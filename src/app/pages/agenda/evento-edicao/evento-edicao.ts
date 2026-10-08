import { Component, OnInit, signal, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '../../../models/Evento';
import { Acolhido } from '../../../models/Acolhido';
import { Funcionario } from '../../../models/Funcionario';
import { EventoService } from '../../../services/evento/evento.service';
import { AcolhidoService } from '../../../services/acolhido/acolhido.service';
import { FuncionarioService } from '../../../services/funcionario/funcionario.service';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edicao-evento',
  standalone: true,
  imports: [RouterLink, Sidebar, Header, FormsModule],
  templateUrl: './evento-edicao.html',
  styleUrl: './evento-edicao.css',
})
export class EdicaoEvento implements OnInit {
  salvando = false;
  // Criação de objetos
  evento: Evento = new Evento();

  // Listas
  acolhidos = signal<Acolhido[]>([]);
  responsaveis = signal<Funcionario[]>([]);

  filtroAcolhido: string = '';
  filtroResponsavel: string = '';

  // Injeção do serviço responsável pelas operações com acolhidos, eventos e funcionários
  private acolhidoService = inject(AcolhidoService);
  private eventoService = inject(EventoService);
  private funcionarioService = inject(FuncionarioService);

  constructor(
    private rota: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  @ViewChild('form')
  formulario!: NgForm;

  ngOnInit(): void {
    const id = Number(this.rota.snapshot.paramMap.get('id'));

    // Listas
    this.acolhidoService.selecionar().subscribe((res) => this.acolhidos.set(res));
    this.funcionarioService.selecionar().subscribe((res) => this.responsaveis.set(res));

    // Evento
    this.eventoService.buscarPorId(id).subscribe({
      next: (retorno) => {
        //console.log('EVENTO:', retorno);

        this.evento = retorno;

        this.evento.acolhidos = retorno.acolhidos ?? [];
        this.evento.responsaveis = retorno.responsaveis ?? [];

        // Segurança
        this.evento.acolhidos = [...this.evento.acolhidos];
        this.evento.responsaveis = [...this.evento.responsaveis];

        if (this.evento.data) {
          const dataUTC = new Date(this.evento.data);

          // Compensa o offset para não deixar o UTC "roubar" um dia
          const dataLocal = new Date(
            dataUTC.getUTCFullYear(),
            dataUTC.getUTCMonth(),
            dataUTC.getUTCDate(),
          );

          // Formato yyyy-MM-dd que o input[type="date"] espera
          this.evento.data = dataLocal.toLocaleDateString('en-CA');
        }
        this.cdr.detectChanges();
      },

      error: (err) => console.error(err),
    });
  }

  // EDITAR
  editar(): void {
    if (this.salvando) {
      return;
    }

    const eventoParaEnviar = {
      ...this.evento,
      data: this.evento.data ? this.evento.data + 'T12:00:00' : this.evento.data,
    };

    this.salvando = true;

    this.eventoService.editar(eventoParaEnviar).subscribe({
      next: () => {
        this.salvando = false;

        this.toastr.success('Evento editado com sucesso!');
        this.router.navigate(['/agenda/listagem']);
      },

      error: (err) => {
        this.salvando = false;
        console.error('Erro ao editar evento:', err);
        this.toastr.error(err.error?.message || 'Erro ao editar evento');
      },
    });
  }

  // FILTROS
  filtrarAcolhidos(): Acolhido[] {
    const lista = this.acolhidos();

    return lista
      .filter((a) => !a.dataSaida)
      .filter((a) =>
        this.filtroAcolhido.trim()
          ? a.nome.toLowerCase().includes(this.filtroAcolhido.toLowerCase())
          : true,
      );
  }

  // Filtro de responsáveis
  filtrarResponsaveis(): Funcionario[] {
    const lista = this.responsaveis();

    return lista
      .filter((r) => !r.dataSaida)
      .filter((r) =>
        this.filtroResponsavel.trim()
          ? r.nome.toLowerCase().includes(this.filtroResponsavel.toLowerCase())
          : true,
      );
  }

  // Seleção/Deseleção de Acolhidos
  toggleAcolhido(id: number): void {
    if (this.evento.acolhidos.includes(id)) {
      this.evento.acolhidos = this.evento.acolhidos.filter((a) => a !== id);
    } else {
      this.evento.acolhidos.push(id);
    }
    this.cdr.detectChanges();
  }

  // Verificar se está selecionado
  isAcolhidoSelecionado(id: number): boolean {
    return this.evento.acolhidos.includes(id);
  }

  toggleResponsavel(id: number): void {
    if (this.evento.responsaveis.includes(id)) {
      this.evento.responsaveis = this.evento.responsaveis.filter((r) => r !== id);
    } else {
      this.evento.responsaveis.push(id);
    }
  }

  isResponsavelSelecionado(id: number): boolean {
    return this.evento.responsaveis.includes(id);
  }

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
