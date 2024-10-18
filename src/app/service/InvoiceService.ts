import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = 'https://localhost:7029/api/Invoice';

  constructor(private http: HttpClient) {}

  
  getInvoiceDetails(searchParams: any): Observable<any> {
    let params = new HttpParams()
      .set('receiptNo', searchParams.receiptNo ? searchParams.receiptNo.toString() : '')
      .set('storeId', searchParams.storeId ? searchParams.storeId.toString() : '')
      .set('fromDate', searchParams.fromDate || '')
      .set('toDate', searchParams.toDate || '')
      .set('pageNumber', searchParams.pageNumber ? searchParams.pageNumber.toString() : '1') 
      .set('pageSize', searchParams.pageSize ? searchParams.pageSize.toString() : '100'); 

    return this.http.get(this.apiUrl, { params });
  }

  getInvoiceById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateInvoice(id: number, invoiceData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, invoiceData);
  }
}
