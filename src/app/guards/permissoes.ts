export const permissoes = {
  funcionario: {
    cadastrar: ['Coordenador', 'Auxiliar Administrativo'],
    listar: ['Coordenador', 'Auxiliar administrativo'],
    editar: ['Coordenador', 'Auxiliar administrativo'],
    excluir: ['Coordenador'],
  },

  medicamento: {
    cadastrar: ['Coordenador', 'Cuidador(a)', 'Psicólogo(a)', 'Auxiliar administrativo'],
    listar: ['Coordenador', 'Psicólogo(a)', 'Auxiliar administrativo', 'Cuidador(a)'],
    editar: ['Coordenador', 'Cuidador(a)', 'Psicólogo(a)', 'Auxiliar administrativo'],
    excluir: ['Coordenador', 'Cuidador(a)'],

    entrada: ['Coordenador', 'Cuidador(a)', 'Psicólogo(a)'],
    saida: ['Coordenador', 'Cuidador(a)', 'Psicólogo(a)'],
    administracao: ['Coordenador', 'Cuidador(a)', 'Psicólogo(a)'],
  },

  produto: {
    cadastrar: ['Coordenador', 'Auxiliar administrativo'],
    listar: [
      'Coordenador',
      'Psicólogo(a)',
      'Auxiliar administrativo',
      'Cuidador(a)',
      'Cozinheiro(a)',
      'Auxiliar de cozinha',
      'Auxiliar de serviços gerais',
    ],
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
    cadastrar: ['Coordenador', 'Auxiliar administrativo', 'Psicólogo(a)', 'Cuidador(a)'],
    listar: [
      'Coordenador',
      'Psicólogo(a)',
      'Auxiliar administrativo',
      'Cuidador(a)',
      'Cozinheiro(a)',
      'Auxiliar de cozinha',
      'Auxiliar de serviços gerais',
    ],
    editar: ['Coordenador', 'Auxiliar administrativo', 'Psicólogo(a)', 'Cuidador(a)'],
    excluir: ['Coordenador', 'Auxiliar administrativo', 'Psicólogo(a)', 'Cuidador(a)'],
  },

  acolhido: {
    cadastrar: ['Coordenador', 'Psicólogo(a)', 'Auxiliar administrativo'],
    listar: ['Coordenador', 'Psicólogo(a)', 'Auxiliar administrativo', 'Cuidador(a)'],
    editar: ['Coordenador', 'Psicólogo(a)', 'Auxiliar administrativo'],
    excluir: ['Coordenador', 'Auxiliar administrativo'],
  },

  relatorio: {
    listar: ['Coordenador', 'Auxiliar Administrativo'],
  },
};
