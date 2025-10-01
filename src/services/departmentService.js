import BaseService from './base/BaseService';

class DepartmentService extends BaseService {
  constructor() {
    super('/department');
  }

  
  getListDepartment = async () => {
    const response = await this.get('/');
    const departments = response.departments || [];

    const childrenMap = new Map();
    departments.forEach((dept) => {
      if(dept.parent_id) {
          if(!childrenMap.has(dept.parent_id)) {
            childrenMap.set(dept.parent_id, []);
          }
          childrenMap.get(dept.parent_id).push(dept.id);
      }
    })
    return departments.map((dept) => ({
      ...dept,
      children: childrenMap.get(dept.id) || [],
    }))
  } ;

  createDepartment = async (data) => this.post('/', data);

  deleteDepartment = async (idDepartment) => this.delete(`/${idDepartment}`);

  updateDepartment = async (idDepartment, data) => this.patch(`/${idDepartment}`, data);

  getListDepartmentForUpdate = async (idDepartment) =>
    this.get(`/${idDepartment}/department-for-update`);
}

const departmentService = new DepartmentService();
export default departmentService;
