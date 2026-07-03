import Parse from './back4app';

export interface TarefaData {
  objectId?: string;
  titulo: string;
  categoria: string;
  dificuldade: string;
  concluido: boolean;
  descricao?: string;
  createdAt?: Date;
}

export const criarTarefa = async (dados: TarefaData) => {
  const currentUser = Parse.User.current();

  if (!currentUser) {
    throw new Error("Sessão perdida! Faça login novamente.");
  }

  const Tarefa = Parse.Object.extend("Tarefa");
  const tarefa = new Tarefa();

  tarefa.set("titulo", dados.titulo);
  tarefa.set("categoria", dados.categoria);
  tarefa.set("dificuldade", dados.dificuldade);
  if (dados.descricao) {
    tarefa.set("descricao", dados.descricao);
  }
  tarefa.set("concluido", false);
  tarefa.set("criadoPor", currentUser); 

  const acl = new Parse.ACL(currentUser);
  acl.setPublicReadAccess(false);
  acl.setPublicWriteAccess(false);
  tarefa.setACL(acl);

  try {
    const result = await tarefa.save();
    return result;
  } catch (error) {
    console.error("Erro no Back4App:", error);
    throw error;
  }
};

export const listarTarefas = async (): Promise<TarefaData[]> => {
  const Tarefa = Parse.Object.extend("Tarefa");
  const query = new Parse.Query(Tarefa);

  query.descending("createdAt");

  try {
    const results = await query.find();
    return results.map((obj: any) => ({
      objectId: obj.id,
      titulo: obj.get("titulo"),
      categoria: obj.get("categoria"),
      dificuldade: obj.get("dificuldade"),
      concluido: obj.get("concluido"),
      descricao: obj.get("descricao") || "",
      createdAt: obj.get("createdAt"),
    }));
  } catch (error) {
    console.error("Erro ao buscar tarefas: ", error);
    return [];
  }
};

export const toggleConcluirTarefa = async (id: string, statusAtual: boolean) => {
  const Tarefa = Parse.Object.extend("Tarefa");
  const query = new Parse.Query(Tarefa);

  try {
    const tarefa = await query.get(id);
    tarefa.set("concluido", !statusAtual);
    await tarefa.save();
    return true;
  } catch (error) {
    console.error("Erro ao atualizar tarefa: ", error);
    return false;
  }
};

export const excluirTarefa = async (id: string) => {
  const Tarefa = Parse.Object.extend("Tarefa");
  const query = new Parse.Query(Tarefa);

  try {
    const tarefa = await query.get(id);
    await tarefa.destroy();
    return true;
  } catch (error) {
    console.error("Erro ao excluir tarefa: ", error);
    return false;
  }
};

export const atualizarTarefa = async (
  id: string,
  dados: Pick<TarefaData, 'titulo' | 'categoria' | 'dificuldade' | 'descricao'>
) => {
  const Tarefa = Parse.Object.extend("Tarefa");
  const query = new Parse.Query(Tarefa);

  try {
    const tarefa = await query.get(id);
    tarefa.set("titulo", dados.titulo);
    tarefa.set("categoria", dados.categoria);
    tarefa.set("dificuldade", dados.dificuldade);
    if (dados.descricao !== undefined) {
      tarefa.set("descricao", dados.descricao);
    }
    await tarefa.save();
    return true;
  } catch (error) {
    console.error("Erro ao atualizar tarefa: ", error);
    return false;
  }
};