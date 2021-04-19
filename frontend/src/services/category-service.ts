import CategoryModel from '../model/categories-model';
import { servicesSettings } from './services.config';
import axios, { AxiosResponse } from 'axios';
const baseApi = axios.create(servicesSettings);

export default class CategoryService {
  ListCategories(): Promise<AxiosResponse<Array<CategoryModel>>> {
    return baseApi.get('/api/Categories');
  }
}