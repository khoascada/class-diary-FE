import BaseService from "./base/BaseService";

class DepartmentService extends BaseService {
    constructor() {
        super('/department');
    }

    async createDepartment(data)  {
        return this.post('/', data);
    }
    async deleteDepartment(idDepartment) {
        return this.delete(`/${idDepartment}`)
    }
}

export default new DepartmentService()