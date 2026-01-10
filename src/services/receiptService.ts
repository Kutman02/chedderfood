// Сервис для работы с чеками в localStorage
import type { CustomerData, ReceiptData } from '../types/types';

export class ReceiptService {
  private static readonly RECEIPTS_KEY = 'chedderfood_receipts';
  private static readonly CUSTOMER_DATA_KEY = 'chedderfood_customer_data';

  // Сохранение чека
  static saveReceipt(receipt: ReceiptData): void {
    try {
      const receipts = this.getAllReceipts();
      receipts.unshift(receipt); // Добавляем новый чек в начало
      // Храним только последние 50 чеков
      if (receipts.length > 50) {
        receipts.splice(50);
      }
      localStorage.setItem(this.RECEIPTS_KEY, JSON.stringify(receipts));
    } catch (error) {
      console.error('Error saving receipt:', error);
    }
  }

  // Получение всех чеков
  static getAllReceipts(): ReceiptData[] {
    try {
      const receipts = localStorage.getItem(this.RECEIPTS_KEY);
      return receipts ? JSON.parse(receipts) : [];
    } catch (error) {
      console.error('Error getting receipts:', error);
      return [];
    }
  }

  // Удаление чека
  static deleteReceipt(receiptId: number): void {
    try {
      const receipts = this.getAllReceipts();
      const filteredReceipts = receipts.filter(receipt => receipt.id !== receiptId);
      localStorage.setItem(this.RECEIPTS_KEY, JSON.stringify(filteredReceipts));
    } catch (error) {
      console.error('Error deleting receipt:', error);
    }
  }

  // Удаление всех чеков
  static clearAllReceipts(): void {
    try {
      localStorage.removeItem(this.RECEIPTS_KEY);
    } catch (error) {
      console.error('Error clearing receipts:', error);
    }
  }

  // Сохранение данных клиента для автозаполнения
  static saveCustomerData(data: CustomerData): void {
    try {
      localStorage.setItem(this.CUSTOMER_DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving customer data:', error);
    }
  }

  // Получение данных клиента для автозаполнения
  static getCustomerData(): CustomerData | null {
    try {
      const data = localStorage.getItem(this.CUSTOMER_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting customer data:', error);
      return null;
    }
  }

  // Очистка данных клиента
  static clearCustomerData(): void {
    try {
      localStorage.removeItem(this.CUSTOMER_DATA_KEY);
    } catch (error) {
      console.error('Error clearing customer data:', error);
    }
  }
}
