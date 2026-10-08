import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { AgendaMedicamentoService } from '../../../services/medicamento/agenda-medicamento.service';

@Component({
  selector: 'app-medicamento-administracao',
  imports: [Header, Sidebar, CommonModule, FormsModule],
  templateUrl: './medicamento-administracao.html',
  styleUrl: './medicamento-administracao.css',
})
export class MedicamentoAdministracao implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private agendaService = inject(AgendaMedicamentoService);
  private toastr = inject(ToastrService);

  agendas: any[] = [];
  agendasFiltradas: any[] = [];

  dataSelecionada: string = '';
  acolhidoSelecionado: string = '';

  carregando = false;

  ngOnInit(): void {
    this.definirDataAtual();
    this.carregarAgendas();
  }

  definirDataAtual(): void {
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');

    this.dataSelecionada = `${ano}-${mes}-${dia}`;
  }

  carregarAgendas(): void {
    console.time('carregar-agendas');
    this.carregando = true;
    this.agendaService.selecionar(this.dataSelecionada).subscribe({
      next: (dados) => {
        this.agendas = dados ?? [];
        this.cdr.detectChanges();
        this.filtrarAgendas();
        this.carregando = false;
      },

      error: (erro) => {
        this.carregando = false;
        const mensagem =
          erro?.error?.message ||
          erro?.error ||
          'Não foi possível carregar as administrações de medicamentos.';

        this.toastr.error(mensagem, 'Erro');
      },
    });
  }

  filtrarAgendas(): void {
    this.agendasFiltradas = this.agendas.filter((agenda) => {
      const mesmaData = !this.dataSelecionada || agenda.data === this.dataSelecionada;
      const nomeAcolhido = agenda.acolhido?.nome ?? '';
      const mesmoAcolhido = !this.acolhidoSelecionado || nomeAcolhido === this.acolhidoSelecionado;
      return mesmaData && mesmoAcolhido;
    });

    this.ordenarPorHorario();
  }

  ordenarPorHorario(): void {
    this.agendasFiltradas.sort((a, b) => {
      const horarioA = a.horario ?? '';
      const horarioB = b.horario ?? '';

      return horarioA.localeCompare(horarioB);
    });
  }

  get acolhidos(): any[] {
    const mapa = new Map<number, any>();

    this.agendas.forEach((agenda) => {
      if (agenda.acolhido?.id) {
        mapa.set(agenda.acolhido.id, agenda.acolhido);
      }
    });

    return Array.from(mapa.values()).sort((a, b) => a.nome.localeCompare(b.nome));
  }

  classeStatus(status: string): string {
    switch (status) {
      case 'DADO':
        return 'status-dado';

      case 'NAO_TOMOU':
        return 'status-nao-tomou';

      case 'PENDENTE':
        return 'status-pendente';

      default:
        return 'status-pendente';
    }
  }

  textoStatus(status: string): string {
    switch (status) {
      case 'DADO':
        return 'Dado';

      case 'NAO_TOMOU':
        return 'Não tomou';

      case 'PENDENTE':
        return 'Pendente';

      default:
        return status ?? 'Pendente';
    }
  }

  isPendente(agenda: any): boolean {
    return agenda.status === 'PENDENTE';
  }

  administrar(agenda: any): void {
    Swal.fire({
      title: 'Administrar medicamento?',
      text: `Confirmar a administração de ${agenda.medicamento?.nome ?? 'medicamento'} para ${agenda.acolhido?.nome ?? 'acolhido'}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, administrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#198754',
    }).then((resultado) => {
      if (!resultado.isConfirmed) {
        return;
      }

      this.agendaService.marcarTomou(agenda.id).subscribe({
        next: (resposta) => {
          agenda.status = 'DADO';
          agenda.dataBaixa = resposta?.dataBaixa ?? agenda.dataBaixa;

          this.toastr.success('Medicamento administrado com sucesso.', 'Sucesso');

          this.filtrarAgendas();
        },

        error: (erro) => {
          console.error('Erro ao administrar medicamento:', erro);

          const mensagem =
            erro?.error?.message || erro?.error || 'Não foi possível administrar o medicamento.';

          this.toastr.error(mensagem, 'Erro');
        },
      });
    });
  }

  naoTomou(agenda: any): void {
    Swal.fire({
      title: 'Medicamento não administrado',
      text: 'Informe o motivo:',
      input: 'textarea',
      inputPlaceholder: 'Digite o motivo...',
      inputAttributes: {
        'aria-label': 'Motivo',
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      inputValidator: (valor) => {
        if (!valor || !valor.trim()) {
          return 'Informe o motivo.';
        }

        return null;
      },
    }).then((resultado) => {
      if (!resultado.isConfirmed) {
        return;
      }

      const motivo = resultado.value.trim();

      this.agendaService.marcarNaoTomou(agenda.id, motivo).subscribe({
        next: () => {
          agenda.status = 'NAO_TOMOU';
          agenda.motivoNaoTomou = motivo;

          this.toastr.success('Registro atualizado com sucesso.', 'Sucesso');

          this.filtrarAgendas();
        },

        error: (erro) => {
          console.error('Erro ao registrar medicamento não tomado:', erro);

          const mensagem =
            erro?.error?.message || erro?.error || 'Não foi possível atualizar o registro.';

          this.toastr.error(mensagem, 'Erro');
        },
      });
    });
  }

  limparFiltros(): void {
    this.definirDataAtual();
    this.acolhidoSelecionado = '';

    this.filtrarAgendas();
  }

  get quantidadePendentes(): number {
    return this.agendasFiltradas.filter((agenda) => agenda.status === 'PENDENTE').length;
  }

  get quantidadeDados(): number {
    return this.agendasFiltradas.filter((agenda) => agenda.status === 'DADO').length;
  }

  get quantidadeNaoTomados(): number {
    return this.agendasFiltradas.filter((agenda) => agenda.status === 'NAO_TOMOU').length;
  }
}
