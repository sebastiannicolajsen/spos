import { AppDataSource } from './repositories/data-source';
import api from './api';
import Container from 'typedi';
import AuthService from './services/AuthService';
import EventBusService from './services/EventBusService';
import SellerService from './services/SellerService';


AppDataSource.initialize()
  .then(async () => {
    api();
  })
  .catch((error) => console.log(error));
