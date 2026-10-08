import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Funcionario } from '../../../models/Funcionario';
import { FuncionarioService } from '../../../services/funcionario/funcionario.service';
import { NgxMaskDirective } from 'ngx-mask';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-funcionario-edicao',
  imports: [RouterLink, FormsModule, Header, NgxMaskDirective, Sidebar],
  templateUrl: './funcionario-edicao.html',
  styleUrl: './funcionario-edicao.css',
})
export class FuncionarioEdicao implements OnInit {
  salvando = false;
  // Objeto do tipo funcionário
  funcionario: Funcionario = new Funcionario();

  // Injeção do serviço responsável pelas operações com funcionários
  private servico = inject(FuncionarioService);

  constructor(
    private rota: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
  ) {}

  //Método de edição
  editar(): void {
    if (this.salvando) {
      return;
    }

    this.salvando = true;

    this.servico.editar(this.funcionario).subscribe({
      next: () => {
        this.salvando = false;

        this.funcionario.ativo = !this.funcionario.dataSaida;

        this.toastr.success('Funcionário editado com sucesso!');
      },

      error: (err) => {
        this.salvando = false;

        console.error('Erro ao editar funcionário:', err);

        this.toastr.error(err.error?.message || 'Erro ao editar funcionário.', 'Erro');
      },
    });
  }

  ngOnInit() {
    const id = Number(this.rota.snapshot.paramMap.get('id'));
    this.servico.buscarPorId(id).subscribe((retorno) => {
      this.funcionario = retorno;

      this.funcionario.dataNascimento = this.formatarData(this.funcionario.dataNascimento);
      this.funcionario.dataAdmissao = this.formatarData(this.funcionario.dataAdmissao);
      this.funcionario.dataSaida = this.formatarData(this.funcionario.dataSaida);

      this.cdr.detectChanges();
    });
  }

  // Método para formatar data dd/MM/aaaa
  formatarData(data: any): string {
    if (!data) return '';

    const d = new Date(data);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
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
