import BaseService from "./base/BaseService";

class DepartmentService extends BaseService {
  constructor() {
    super("/department");
  }

  // Arrow functions để giữ this
  getListDepartment = async () => this.get("/");

  createDepartment = async (data) => this.post("/", data);

  deleteDepartment = async (idDepartment) => this.delete(`/${idDepartment}`);

  updateDepartment = async (idDepartment, data) => this.patch(`/${idDepartment}`, data);

  getListDepartmentForUpdate = async (idDepartment) =>
    this.get(`/${idDepartment}/department-for-update`);
}

const departmentService = new DepartmentService();
export default departmentService;
