import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AgendaMedicamentoService {
  private http = inject(HttpClient);

  private api: string = `${environment.apiUrl}/controle-medicamento/agenda`;

  selecionar(data: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/listagem`, {
      params: {
        data,
      },
    });
  }

  buscarPorAcolhido(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/acolhido/${id}`);
  }

  marcarTomou(id: number): Observable<any> {
    return this.http.put(`${this.api}/tomou/${id}`, {});
  }

  marcarNaoTomou(id: number, motivo: string) {
    return this.http.put(`${this.api}/nao-tomou/${id}`, motivo, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
