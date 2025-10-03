import BaseService from './base/BaseService';

class PermissionService extends BaseService {
  constructor() {
    super('/permission');
  }

  getListPermission = async () => this.get('/permission-group');

  createDepartment = async (data) => this.post('/', data);

  deleteDepartment = async (idDepartment) => this.delete(`/${idDepartment}`);

  updateDepartment = async (idDepartment, data) => this.patch(`/${idDepartment}`, data);

  getListDepartmentForUpdate = async (idDepartment) =>
    this.get(`/${idDepartment}/department-for-update`);
}

const permissionService = new PermissionService();
export default permissionService;
