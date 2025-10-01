import BaseService from './base/BaseService';

class RoleService extends BaseService {
  constructor() {
    super('/department');
  }

  getListRoles = async () => this.get('/');

  createDepartment = async (data) => this.post('/', data);

  deleteDepartment = async (idDepartment) => this.delete(`/${idDepartment}`);

  updateDepartment = async (idDepartment, data) => this.patch(`/${idDepartment}`, data);

  getListDepartmentForUpdate = async (idDepartment) =>
    this.get(`/${idDepartment}/department-for-update`);
}

const roleService = new RoleService();
export default roleService;
