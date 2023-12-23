import config from "../../config/config";
import {CustomHttp} from "../services/custom-http";
import {Sidebar} from "./sidebar";
import {Functions} from "./functions";
import {CategoriesType} from "../types/categories.type";
import {OperationsType} from "../types/operations.type";
import {TotalAmountByCategoryType} from "../types/total-amount-by-Category.type";
import {Chart} from "chart.js";


export class Main {
    constructor() {
        Sidebar.sidebarButtons('main');
        Functions.initOperations(this.handleButtonClick.bind(this));
        this.showPieChart('income');
        this.showPieChart('expense');
    }

    handleButtonClick(button: HTMLElement) {

        const period: string | null = button.id === 'interval' ? Functions.getIntervalPeriod() : `/operations?period=${button.id}`;

        if (period) {
            Functions.returnLabelDates();
            this.showPieChart('income', period);
            this.showPieChart('expense', period);
        } else {
            const incomeContainer: HTMLElement | null = document.getElementById('income-container');
            const expenseContainer: HTMLElement | null = document.getElementById('expense-container');
            if (incomeContainer) {
                incomeContainer.innerHTML = '';
            }
            if (expenseContainer) {
                expenseContainer.innerHTML = '';
            }
        }

    }


    private async showPieChart(type: string, period: string = '/operations?period=all'): Promise<void> {

        const containerId: string = type === 'income' ? 'income-container' : 'expense-container';
        const canvasId: string = type === 'income' ? 'pieChartIncome' : 'pieChartExpense';
        const typeApiUrl: string = type === 'income' ? '/categories/income' : '/categories/expense';

        const canvasContainer: HTMLElement | null = document.getElementById(containerId);
        if (canvasContainer) {
            canvasContainer.innerHTML = `<canvas id=${canvasId}></canvas>`;
        }


        const arrayCategories: CategoriesType[] = await CustomHttp.request(config.host + typeApiUrl);
        const allCategories: string[] = arrayCategories.map((item: CategoriesType) => item.title);
        const operations: OperationsType[] = await CustomHttp.request(config.host + period);
        const allOperations: OperationsType[] = operations.filter(item => item.type === type);
        const totalAmountByCategory: number[] = allCategories.map(category => {
            let sum: number = allOperations.reduce((total: number, obj: OperationsType) => {
                if (obj.category === category) {
                    return total + obj.amount;
                }
                return total;
            }, 0);
            return sum;
        });

        const clearTotalAmountByCategory: TotalAmountByCategoryType[] = allCategories.reduce((acc: TotalAmountByCategoryType[], category: string | undefined, index: number ) => {
            if (totalAmountByCategory[index] !== 0 && totalAmountByCategory[index] !== 0 && category) {
                acc.push({category: category, amount: totalAmountByCategory[index]});
            }
            return acc;
        }, []);



        this.createChart(canvasId, clearTotalAmountByCategory);
    }

    private createChart(canvasId: string, clearTotalAmountByCategory: TotalAmountByCategoryType[]): void {
        let labels: string[] = clearTotalAmountByCategory.map(item => item.category);

        let data: number[] = clearTotalAmountByCategory.map(item => item.amount);
        const backgroundColors: string[] = [
            '#DC3545',
            '#20C997',
            '#0D6EFD',
            '#FFC107',
            '#FD7E14'
        ];

        const canvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
        const ctx: CanvasRenderingContext2D | null = canvasElement ? canvasElement.getContext('2d') : null;

        if (ctx) {
            const chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: backgroundColors
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: 'Расходы за период'
                        }
                    },

                }
            });
        }

    }
}

