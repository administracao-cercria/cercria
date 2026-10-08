import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { MedicamentoService } from '../../../services/medicamento/medicamento.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Medicamento } from '../../../models/Medicamento';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicamento-edicao',
  imports: [RouterLink, FormsModule, Header, Sidebar],
  templateUrl: './medicamento-edicao.html',
  styleUrl: './medicamento-edicao.css',
})
export class MedicamentoEdicao {
  salvando = false;
  // Objeto do tipo medicamento
  medicamento: Medicamento = new Medicamento();

  // Injeção do serviço responsável pelas operações com medicamentos
  private servico = inject(MedicamentoService);
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

    this.servico.editar(this.medicamento).subscribe({
      next: () => {
        this.salvando = false;

        this.toastr.success('Medicamento editado com sucesso!');
      },

      error: (err) => {
        this.salvando = false;

        console.error('Erro ao editar medicamento:', err);

        this.toastr.error(err.error?.message || 'Erro ao editar medicamento.', 'Erro');
      },
    });
  }

  ngOnInit() {
    const id = Number(this.rota.snapshot.paramMap.get('id'));
    this.servico.buscarPorId(id).subscribe((retorno) => {
      this.medicamento = retorno;
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
