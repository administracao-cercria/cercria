import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ControleMedicamentoService {
  private http = inject(HttpClient);

  private url: string = `${environment.apiUrl}/controle-medicamento`;

  cadastrar(controle: any, confirmarSemEstoque: boolean = false) {
    return this.http.post(
      `${this.url}/cadastro?confirmarSemEstoque=${confirmarSemEstoque}`,
      controle,
    );
  }

  salvarSaidaEsporadica(dados: any) {
    return this.http.post(`${this.url}/agenda/esporadico`, dados);
  }

  listarPorAcolhido(acolhidoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/acolhido/${acolhidoId}`);
  }
}
