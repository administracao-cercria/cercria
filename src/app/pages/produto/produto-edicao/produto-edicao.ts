import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { ProdutoService } from '../../../services/produto/produto.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Produto } from '../../../models/Produto';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-produto-edicao',
  imports: [RouterLink, FormsModule, Header, Sidebar],
  templateUrl: './produto-edicao.html',
  styleUrl: './produto-edicao.css',
})
export class ProdutoEdicao {
  salvando = false;
  // Objeto do tipo produto
  produto: Produto = new Produto();

  // Injeção do serviço responsável pelas operações com produto
  private servico = inject(ProdutoService);
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

    this.servico.editar(this.produto).subscribe({
      next: () => {
        this.salvando = false;
        this.toastr.success('Produto editado com sucesso!');
      },

      error: (err) => {
        this.salvando = false;
        console.error('Erro ao editar produto:', err);
        this.toastr.error(err.error?.message || 'Erro ao editar produto.', 'Erro');
      },
    });
  }

  ngOnInit() {
    const id = Number(this.rota.snapshot.paramMap.get('id'));
    this.servico.buscarPorId(id).subscribe((retorno) => {
      this.produto = retorno;
      this.cdr.detectChanges();
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
}
