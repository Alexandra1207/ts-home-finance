import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Functions {
    static async deleteUndefinedOperations() {
        const that = this;
        const result = await CustomHttp.request(config.host + '/operations?period=all');
        const undefinedOperations = result.filter(obj => !("category" in obj));
        undefinedOperations.forEach(function (item) {
            that.deleteOperation(item.id);
        })
    }

    static async deleteOperation(id) {
        return await CustomHttp.request(config.host + '/operations/' + id, 'DELETE');
    }

    static async deleteCategory(id) {
        return await CustomHttp.request(config.host + '/categories/expense/' + id, 'DELETE');
    }

    static async createCategory(type, name) {
        return await CustomHttp.request(config.host + '/categories/' + type, 'POST', {"title": name});
    }
}