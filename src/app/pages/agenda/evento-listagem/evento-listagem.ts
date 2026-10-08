import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { ChangeDetectorRef } from '@angular/core';
import { EventoService } from '../../../services/evento/evento.service';
import { Evento } from '../../../models/Evento';
import { AcolhidoService } from '../../../services/acolhido/acolhido.service';
import { FuncionarioService } from '../../../services/funcionario/funcionario.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { permissoes } from '../../../guards/permissoes';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendario-inicial',
  standalone: true,
  imports: [CommonModule, RouterLink, Header, Sidebar, FullCalendarModule, FormsModule],
  templateUrl: './evento-listagem.html',
  styleUrls: ['./evento-listagem.css'],
})
export class EventoListagem implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  eventoSelecionado: Evento | null = null;
  mostrarPopup: boolean = false;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    locale: ptBrLocale,
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],

    editable: true,
    selectable: true,

    // Máximo de 5 eventos visíveis por dia
    dayMaxEvents: 3,

    // Ao clicar em "+ X mais", abre o dia
    moreLinkClick: 'day',

    // Ao clicar no número/célula do dia, abre a visualização daquele dia
    dateClick: (info) => {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.changeView('timeGridDay', info.date);
    },

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },

    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Dia',
    },

    height: 'auto',
    events: [],

    eventClick: (info) => {
      this.tipoSelecionado = 'evento';
      this.abrirPopup(Number(info.event.id));
    },
  };

  // Injeção do serviço responsável pelas operações com acolhidos, eventos, funcionários
  private acolhidoService = inject(AcolhidoService);
  private eventoService = inject(EventoService);
  private funcionarioService = inject(FuncionarioService);

  tipoSelecionado = '';

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.carregarEventos();

    this.acolhidoService.selecionar().subscribe((res) => {
      this.acolhidosLista = res;
    });

    this.funcionarioService.selecionar().subscribe((res) => {
      this.responsaveisLista = res;
    });
  }

  ngAfterViewInit(): void {
    this.carregarEventos();
  }

  // Método para carregar os eventos
  carregarEventos(): void {
    const calendarApi = this.calendarComponent?.getApi();

    if (!calendarApi) return;

    calendarApi.removeAllEvents();

    this.eventoService.selecionar().subscribe({
      next: (eventos) => {
        const listaEventos = eventos.map((evento) => ({
          id: String(evento.id),
          title: evento.nome,
          start: this.formatarData(evento.data, evento.hora),
          color: '#3788d8',
          extendedProps: {
            tipo: 'evento',
          },
        }));

        calendarApi.addEventSource(listaEventos);
      },
    });
  }

  formatarData(data: string, hora: string): string {
    return `${data}T${hora}`;
  }

  abrirPopup(id: number): void {
    this.eventoService.buscarPorId(id).subscribe({
      next: (evento: Evento) => {
        this.eventoSelecionado = evento;
        this.mostrarPopup = true;

        this.cd.detectChanges();
      },
      error: (err) => console.error('Erro ao buscar evento', err),
    });
  }

  fecharPopup(): void {
    this.mostrarPopup = false;
    this.eventoSelecionado = null;

    this.mostrarMotivo = false;
    this.motivoRecusa = '';

    this.cd.detectChanges();
  }

  getCorStatus(status: string): string {
    switch (status) {
      case 'Em andamento':
        return '#1e3b8ae5';
      case 'Finalizado':
        return '#28a745';
      default:
        return '#3788d8';
    }
  }

  //Pegar o status do evento
  getStatusEvento(data: string, hora: string): string {
    const dataEvento = new Date(data);

    const [h, m, s] = hora.split(':');
    dataEvento.setHours(Number(h));
    dataEvento.setMinutes(Number(m));
    dataEvento.setSeconds(Number(s || 0));

    const agora = new Date();

    return agora < dataEvento ? 'Em andamento' : 'Finalizado';
  }

  //Listas
  acolhidosLista: any[] = [];
  responsaveisLista: any[] = [];

  getNomeAcolhido(id: number): string {
    const a = this.acolhidosLista.find((x) => x.id === id);
    return a ? a.nome : 'Desconhecido';
  }

  getNomeResponsavel(id: number): string {
    const r = this.responsaveisLista.find((x) => x.id === id);
    return r ? r.nome : 'Desconhecido';
  }

  mostrarMotivo = false;
  motivoRecusa = '';

  //Método excluir
  excluir(id: number): void {
    Swal.fire({
      title: 'Excluir evento?',
      text: 'Essa ação não poderá ser revertida.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventoService.remover(id).subscribe({
          next: () => {
            this.toastr.success('Evento excluído com sucesso!');
            this.fecharPopup();
            this.carregarEventos();
          },
          error: (err) => {
            console.error(err);
            this.toastr.error('Erro ao excluir evento.');
          },
        });
      }
    });
  }

  temPermissao(permissao: string): boolean {
    const cargo = this.eventoService.getCargo();

    if (!cargo) {
      return false;
    }

    const [modulo, acao] = permissao.split(':');
    const permissoesModulo = permissoes[modulo as keyof typeof permissoes];

    if (!permissoesModulo) {
      return false;
    }

    const cargosPermitidos = permissoesModulo[acao as keyof typeof permissoesModulo];

    if (!cargosPermitidos) {
      return false;
    }

    return cargosPermitidos.includes(cargo);
  }
}
