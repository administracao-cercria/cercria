import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Acolhido } from '../../../models/Acolhido';
import { AcolhidoService } from '../../../services/acolhido/acolhido.service';
import { NgxMaskDirective } from 'ngx-mask';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-acolhido-edicao',
  imports: [RouterLink, FormsModule, Header, NgxMaskDirective, CommonModule, Sidebar],
  templateUrl: './acolhido-edicao.html',
  styleUrl: './acolhido-edicao.css',
})
export class AcolhidoEdicao implements OnInit {
  salvando = false;
  dataAtual: string = new Date().toISOString().split('T')[0];
  acolhido: Acolhido = new Acolhido();
  carregado = false;

  // Injeção do serviço responsável pelas operações com acolhidos
  private servico = inject(AcolhidoService);

  constructor(
    private rota: ActivatedRoute,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  //Método de edição
  editar(): void {
    if (this.salvando) {
      return;
    }

    this.salvando = true;

    this.servico.editar(this.acolhido).subscribe({
      next: () => {
        this.salvando = false;
        this.acolhido.ativo = !this.acolhido.dataSaida;
        this.toastr.success('Acolhido editado com sucesso!');
      },

      error: (err) => {
        this.salvando = false;
        console.error('Erro ao editar acolhido:', err);
        this.toastr.error(err.error?.message || 'Erro ao editar acolhido.', 'Erro');
      },
    });
  }

  formatarData(data?: string): string {
    if (!data) return '';
    return data.split('T')[0];
  }

  ngOnInit(): void {
    //Pega o id para buscar o registro no banco
    const id = Number(this.rota.snapshot.paramMap.get('id'));

    //Carregar dados do acolhido nos campos respectivos
    this.servico.buscarPorId(id).subscribe({
      next: (retorno) => {
        //console.log('RETORNO:', retorno);

        this.acolhido = retorno;

        this.acolhido.dataNascimento = this.formatarData(retorno.dataNascimento);
        this.acolhido.dataEntrada = this.formatarData(retorno.dataEntrada);
        this.acolhido.dataSaida = this.formatarData(retorno.dataSaida);

        this.carregado = true;

        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('ERRO:', erro);
      },
    });
  }

  @ViewChild('form')
  formulario!: NgForm;

  //Método para criar mensagem de formulário não salvo ao sair
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
}
