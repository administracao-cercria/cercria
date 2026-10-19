export const permissoes = {
  funcionario: {
    cadastrar: ['Coordenador', 'Auxiliar Administrativo'],
    listar: ['Coordenador', 'Auxiliar administrativo'],
    editar: ['Coordenador', 'Auxiliar administrativo'],
    excluir: ['Coordenador', 'Auxiliar administrativo'],
  },

  medicamento: {
    cadastrar: ['Coordenador', 'Auxiliar administrativo'],
    listar: ['Coordenador', 'Auxiliar administrativo'],
    editar: ['Coordenador', 'Auxiliar administrativo'],
    excluir: ['Coordenador', 'Auxiliar administrativo'],

    entrada: ['Coordenador', 'Cuidador Social'],
    saida: ['Coordenador', 'Cuidador Social'],
    administracao: ['Coordenador', 'Cuidador Social', 'Psicólogo(a)'],
  },

  produto: {
    cadastrar: ['Coordenador', 'Auxiliar administrativo'],
    listar: ['Coordenador', 'Auxiliar administrativo'],
    editar: ['Coordenador', 'Auxiliar administrativo'],
    excluir: ['Coordenador', 'Auxiliar administrativo'],
    controle: ['Coordenador', 'Auxiliar administrativo'],
  },

  patrimonio: {
    cadastrar: ['Coordenador', 'Auxiliar administrativo'],
    listar: ['Coordenador', 'Auxiliar administrativo'],
    editar: ['Coordenador', 'Auxiliar administrativo'],
    excluir: ['Coordenador', 'Auxiliar administrativo'],
  },

  evento: {
    cadastrar: ['Coordenador', 'Auxiliar administrativo', 'Psicólogo(a)', 'Cuidador Social'],
    listar: ['Coordenador', 'Psicólogo(a)', 'Auxiliar administrativo', 'Cuidador Social'],
    editar: ['Coordenador', 'Auxiliar administrativo', 'Psicólogo(a)', 'Cuidador Social'],
    excluir: ['Coordenador', 'Auxiliar administrativo', 'Psicólogo(a)', 'Cuidador Social'],
  },

  acolhido: {
    cadastrar: ['Coordenador', 'Psicólogo(a)', 'Auxiliar administrativo', 'Cuidador Social'],
    listar: ['Coordenador', 'Psicólogo(a)', 'Auxiliar administrativo', 'Cuidador Social'],
    editar: ['Coordenador', 'Psicólogo(a)', 'Auxiliar administrativo', 'Cuidador Social'],
    excluir: ['Coordenador', 'Auxiliar administrativo', 'Cuidador Social', 'Psicólogo(a)'],
  },

  relatorio: {
    listar: ['Coordenador', 'Auxiliar Administrativo'],
  },
};
