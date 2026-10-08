import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FuncionarioService } from '../../services/funcionario/funcionario.service';

@Component({
  selector: 'app-recuperar-senha',
  imports: [FormsModule, RouterLink],
  templateUrl: './recuperar-senha.html',
  styleUrl: './recuperar-senha.css',
})
export class RecuperarSenha {
  email = '';
  carregando = false;
  emailEnviado = false;

  constructor(
    private servico: FuncionarioService,
    private toastr: ToastrService,
  ) {}

  recuperar() {
    if (!this.email.trim()) {
      this.toastr.warning('Informe seu e-mail.');
      return;
    }

    this.carregando = true;
    this.emailEnviado = false;

    this.servico.recuperarSenha(this.email).subscribe({
      next: () => {
        this.carregando = false;
        this.emailEnviado = true;

        this.toastr.success('Senha temporária enviada para seu e-mail.');
      },

      error: (err) => {
        this.carregando = false;

        if (err.status === 404) {
          this.toastr.error('Nenhum funcionário encontrado com esse e-mail.');
        } else {
          console.error(err);

          this.toastr.error('Não foi possível enviar o e-mail de recuperação.');
        }
      },
    });
  }
}
