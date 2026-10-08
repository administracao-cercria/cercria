import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Funcionario } from '../../../models/Funcionario';
import { FuncionarioService } from '../../../services/funcionario/funcionario.service';
import { NgxMaskDirective } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-funcionario-cadastro',
  imports: [RouterLink, FormsModule, Header, NgxMaskDirective, Sidebar],
  templateUrl: './funcionario-cadastro.html',
  styleUrl: './funcionario-cadastro.css',
})
export class FuncionarioCadastro {
  salvando = false;
  //JSON de funcionario
  funcionarios: Funcionario[] = [];

  // Injeção do serviço responsável pelas operações com funcionários
  private servico = inject(FuncionarioService);

  constructor(
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.confirmarSenha = '';
  }

  //Objeto do tipo funcionário
  funcionario = new Funcionario();

  confirmarSenha: string = '';

  //Método de cadastro
  cadastrar(form: NgForm): void {
    // Impede duplo clique
    if (this.salvando) {
      return;
    }

    // Verifica se o formulário possui erros
    if (form.invalid) {
      form.control.markAllAsTouched();

      this.toastr.error(
        'Preencha corretamente todos os campos obrigatórios.',
        'Formulário inválido',
      );

      return;
    }

    // Verifica se as senhas são iguais
    if (this.funcionario.senha !== this.confirmarSenha) {
      this.toastr.error('As senhas não coincidem!', 'Erro');
      return;
    }

    // Define se o funcionário está ativo
    this.funcionario.ativo = !this.funcionario.dataSaida;

    // Só bloqueia o botão depois que todas as validações passaram
    this.salvando = true;

    this.servico.cadastrar(this.funcionario).subscribe({
      next: (retorno) => {
        this.salvando = false;

        this.funcionarios.push(retorno);
        this.funcionario = new Funcionario();
        this.confirmarSenha = '';

        form.resetForm();

        this.toastr.success('Funcionário cadastrado com sucesso!', 'Sucesso');
        this.router.navigate(['/funcionario/listagem']);
      },

      error: (err) => {
        this.salvando = false;

        console.error('Erro ao cadastrar funcionário:', err);

        if (err.status === 409) {
          this.toastr.warning(err.error, 'E-mail já cadastrado');
        } else {
          this.toastr.error('Erro ao cadastrar funcionário.', 'Erro');
        }
      },
    });
  }

  @ViewChild('form')
  formulario!: NgForm;

  canDeactivate(): Promise<boolean> | boolean {
    console.log(this.formulario?.dirty);

    if (!this.formulario?.dirty) {
      return true;
    }

    return Swal.fire({
      title: 'Existem alterações não salvas',
      text: 'Deseja realmente sair desta página?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, sair',
      cancelButtonText: 'Continuar editando',
    }).then((result) => result.isConfirmed);
  }

  alterarTipoFuncionario(tipo: string): void {
    if (tipo === 'Efetivo') {
      this.funcionario.dataFimContrato = '';
    }
  }
}
