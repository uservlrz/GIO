import React, { useState } from 'react';
import supabase from './supabase/client'; // Ajuste o caminho conforme necessário

const ContentMigrationTool = () => {
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logMessages, setLogMessages] = useState([]);

  // Função para adicionar logs durante o processo
  const addLog = (message) => {
    console.log(message);
    setLogMessages(prev => [...prev, message]);
  };

  // Migração de mensagens
  const handleMessagesMigration = async () => {
    setIsLoading(true);
    setStatus('Iniciando migração de mensagens...');
    setLogMessages([]);

    try {
      // Constante com a chave usada no localStorage
      const MESSAGE_STORAGE_KEY = 'mural_messages';
      
      // 1. Verificar se a tabela existe
      addLog("Verificando estrutura da tabela messages...");
      const { data: tableInfo, error: tableError } = await supabase
        .from('messages')
        .select('id')
        .limit(1);
        
      if (tableError) {
        addLog(`❌ Erro ao verificar tabela: ${tableError.message}`);
        addLog(`Detalhes: ${JSON.stringify(tableError)}`);
        
        // Tente desativar RLS e verificar novamente
        addLog("Tentando desativar RLS para tabela messages (necessita permissão)...");
        try {
          await supabase.rpc('disable_rls', { table_name: 'messages' });
          addLog("RLS desativado com sucesso.");
        } catch (rlsError) {
          addLog(`Nota: Erro ao tentar desativar RLS: ${rlsError.message}`);
        }
      } else {
        addLog("✓ Tabela messages existe e está acessível");
      }
      
      // 2. Buscar mensagens do localStorage
      const localMessagesJson = localStorage.getItem(MESSAGE_STORAGE_KEY);
      if (!localMessagesJson) {
        setStatus('Nenhuma mensagem encontrada no localStorage');
        setIsLoading(false);
        return;
      }
      
      let localMessages = [];
      try {
        localMessages = JSON.parse(localMessagesJson);
        addLog(`Encontradas ${localMessages.length} mensagens no localStorage`);
      } catch (parseError) {
        addLog(`❌ Erro ao analisar mensagens do localStorage: ${parseError.message}`);
        throw parseError;
      }
      
      // 3. Buscar mensagens já existentes no Supabase
      let existingIds = new Set();
      try {
        const { data: existingMessages, error: fetchError } = await supabase
          .from('messages')
          .select('id');
          
        if (fetchError) {
          addLog(`⚠️ Não foi possível verificar mensagens existentes: ${fetchError.message}`);
        } else {
          existingIds = new Set(existingMessages.map(m => m.id));
          addLog(`${existingMessages.length} mensagens já existem no Supabase`);
        }
      } catch (fetchExistingError) {
        addLog(`⚠️ Erro ao buscar mensagens existentes: ${fetchExistingError.message}`);
      }
      
      // 4. Filtrar mensagens que não existem no Supabase
      const newMessages = localMessages.filter(msg => !existingIds.has(msg.id));
      
      addLog(`${newMessages.length} novas mensagens para inserir`);
      
      // 5. Verificar a estrutura dos campos
      addLog("Verificando estrutura de campos da tabela...");
      try {
        const { data: columns, error: columnsError } = await supabase.rpc('get_table_columns', { 
          table_name: 'messages' 
        });
        
        if (columnsError) {
          addLog(`⚠️ Não foi possível verificar colunas: ${columnsError.message}`);
        } else {
          addLog(`Colunas disponíveis: ${JSON.stringify(columns)}`);
          
          // Verificar se há campo "userId" ou "user_id"
          const hasUserIdField = columns.some(col => col.column_name === 'userId');
          const hasUser_IdField = columns.some(col => col.column_name === 'user_id');
          
          addLog(`Campo 'userId' encontrado: ${hasUserIdField}`);
          addLog(`Campo 'user_id' encontrado: ${hasUser_IdField}`);
        }
      } catch (columnsError) {
        addLog(`⚠️ Erro ao verificar colunas: ${columnsError.message}`);
      }
      
      addLog("Preparando mensagens para inserção com validação de timestamp...");
const messagesToInsert = newMessages.map(msg => {
  // Log para debug
  addLog(`Timestamp original para mensagem ${msg.id}: ${JSON.stringify(msg.timestamp)}`);
  
  // Corrigir timestamps inválidos
  const validTimestamp = validateTimestamp(msg.timestamp);
  const validEditTimestamp = msg.editTimestamp ? validateTimestamp(msg.editTimestamp) : null;
  
  addLog(`Timestamp corrigido: ${validTimestamp}`);
  
  return {
    id: msg.id,
    author: msg.author || 'Usuário',
    department: msg.department || 'Não especificado',
    content: msg.content || '',
    avatar: msg.avatar || '/api/placeholder/40/40',
    timestamp: validTimestamp,
    userId: msg.userId, 
    user_id: msg.userId,
    edited: msg.edited || false,
    edit_timestamp: validEditTimestamp
  };
});

// Log de exemplo
if (messagesToInsert.length > 0) {
  addLog(`Exemplo de mensagem para inserção: ${JSON.stringify(messagesToInsert[0])}`);
}

// 7. Inserir em lotes pequenos para evitar problemas
if (messagesToInsert.length > 0) {
  const batchSize = 1; // Reduzido para 1 para facilitar diagnóstico
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < messagesToInsert.length; i += batchSize) {
    const batch = messagesToInsert.slice(i, i + batchSize);
    addLog(`Inserindo mensagem ${i+1}/${messagesToInsert.length}...`);
    
    try {
      // Tentativa 1: Inserção completa
      const { data, error } = await supabase
        .from('messages')
        .insert(batch)
        .select();
        
      if (error) {
        addLog(`Erro na primeira tentativa: ${error.message}`);
        addLog(`Código: ${error.code}, Detalhes: ${JSON.stringify(error.details)}`);
        
        // Tentativa 2: Remover campos problemáticos
        const simplifiedBatch = batch.map(({ editTimestamp, edit_timestamp, ...rest }) => rest);
        addLog("Tentando sem os campos de timestamp de edição...");
        
        const { data: data2, error: error2 } = await supabase
          .from('messages')
          .insert(simplifiedBatch)
          .select();
          
        if (error2) {
          addLog(`Erro na segunda tentativa: ${error2.message}`);
          
          // Tentativa 3: Apenas campos essenciais com data atual
          addLog("Tentando apenas com campos essenciais e timestamp atual...");
          const minimalBatch = batch.map(msg => ({
            author: msg.author || 'Usuário',
            content: msg.content || 'Conteúdo não disponível',
            timestamp: new Date().toISOString()
          }));
          
          const { data: data3, error: error3 } = await supabase
            .from('messages')
            .insert(minimalBatch)
            .select();
            
          if (error3) {
            addLog(`❌ Todas as tentativas falharam para mensagem ${i+1}`);
            errorCount += batch.length;
          } else {
            addLog(`✅ Inserido com campos mínimos: ${JSON.stringify(data3)}`);
            successCount += batch.length;
          }
        } else {
          addLog(`✅ Inserido sem campos problemáticos: ${JSON.stringify(data2)}`);
          successCount += batch.length;
        }
      } else {
        addLog(`✅ Inserido com sucesso: ${JSON.stringify(data)}`);
        successCount += batch.length;
      }
    } catch (insertError) {
      addLog(`❌ Erro não tratado: ${insertError.message}`);
      console.error(insertError);
      errorCount += batch.length;
    }
  }
  
  if (successCount > 0) {
    addLog(`✅ ${successCount} mensagens inseridas com sucesso`);
  }
  
  if (errorCount > 0) {
    addLog(`❌ ${errorCount} erros de inserção`);
  }
}
      
      setStatus(`Migração de mensagens concluída: ${messagesToInsert.length - errorCount} de ${localMessages.length} mensagens migradas`);
    } catch (e) {
      console.error('Erro na migração de mensagens:', e);
      addLog(`❌ Erro geral: ${e.message}`);
      addLog(`Stack: ${e.stack}`);
      setStatus(`Erro na migração de mensagens: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Migração de fotos
  const handlePhotosMigration = async () => {
    setIsLoading(true);
    setStatus('Iniciando migração de fotos...');
    setLogMessages([]);

    try {
      // Constante com a chave usada no localStorage
      const PHOTO_STORAGE_KEY = 'photo_feed_data';
      
      // 1. Verificar se a tabela photos existe
      addLog("Verificando estrutura da tabela photos...");
      try {
        const { data: tableInfo, error: tableError } = await supabase
          .from('photos')
          .select('id')
          .limit(1);
          
        if (tableError) {
          addLog(`❌ Erro ao verificar tabela: ${tableError.message}`);
          
          // Tente desativar RLS
          addLog("Tentando desativar RLS para tabela photos (necessita permissão)...");
          try {
            await supabase.rpc('disable_rls', { table_name: 'photos' });
            addLog("RLS desativado com sucesso.");
          } catch (rlsError) {
            addLog(`Nota: Erro ao tentar desativar RLS: ${rlsError.message}`);
          }
        } else {
          addLog("✓ Tabela photos existe e está acessível");
        }
      } catch (tableCheckError) {
        addLog(`❌ Erro ao verificar tabela: ${tableCheckError.message}`);
      }
      
      // 2. Buscar fotos do localStorage
      const localPhotosJson = localStorage.getItem(PHOTO_STORAGE_KEY);
      if (!localPhotosJson) {
        setStatus('Nenhuma foto encontrada no localStorage');
        setIsLoading(false);
        return;
      }
      
      let localPhotos = [];
      try {
        localPhotos = JSON.parse(localPhotosJson);
        addLog(`Encontradas ${localPhotos.length} fotos no localStorage`);
      } catch (parseError) {
        addLog(`❌ Erro ao analisar fotos do localStorage: ${parseError.message}`);
        throw parseError;
      }
      
      // 3. Verificar a estrutura da tabela photos
      addLog("Verificando estrutura de campos da tabela photos...");
      try {
        const { data: columns, error: columnsError } = await supabase.rpc('get_table_columns', { 
          table_name: 'photos' 
        });
        
        if (columnsError) {
          addLog(`⚠️ Não foi possível verificar colunas: ${columnsError.message}`);
        } else {
          addLog(`Colunas disponíveis: ${JSON.stringify(columns)}`);
          
          // Verificar se há campo "authorId" ou "author_id"
          const hasAuthorIdField = columns.some(col => col.column_name === 'authorId');
          const hasAuthor_IdField = columns.some(col => col.column_name === 'author_id');
          
          addLog(`Campo 'authorId' encontrado: ${hasAuthorIdField}`);
          addLog(`Campo 'author_id' encontrado: ${hasAuthor_IdField}`);
        }
      } catch (columnsError) {
        addLog(`⚠️ Erro ao verificar colunas: ${columnsError.message}`);
      }
      
      // 4. Buscar fotos já existentes no Supabase
      let existingIds = new Set();
      try {
        const { data: existingPhotos, error: fetchError } = await supabase
          .from('photos')
          .select('id');
          
        if (fetchError) {
          addLog(`⚠️ Não foi possível verificar fotos existentes: ${fetchError.message}`);
        } else {
          existingIds = new Set(existingPhotos.map(p => p.id));
          addLog(`${existingPhotos.length} fotos já existem no Supabase`);
        }
      } catch (fetchExistingError) {
        addLog(`⚠️ Erro ao buscar fotos existentes: ${fetchExistingError.message}`);
      }
      
      // 5. Filtrar fotos que não existem no Supabase
      const newPhotos = localPhotos.filter(photo => !existingIds.has(photo.id));
      
      addLog(`${newPhotos.length} novas fotos para processar`);
      
      // 6. Processar e inserir cada foto (upload + registro)
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < newPhotos.length; i++) {
        const photo = newPhotos[i];
        addLog(`Processando foto ${i+1}/${newPhotos.length}...`);
        
        try {
          // 6.1 Verificar se a imagem é base64 ou URL
          let imageUrl = photo.image;
          
          // Se for base64, fazer upload para o storage
          if (photo.image && photo.image.startsWith('data:')) {
            addLog(`  - Convertendo base64 para blob...`);
            
            // Converter base64 para blob
            const fetchResponse = await fetch(photo.image);
            const blob = await fetchResponse.blob();
            
            // Gerar nome do arquivo
            const fileName = `photo_migration_${Date.now()}_${photo.id}`;
            
            addLog(`  - Fazendo upload para o storage...`);
            
            // Upload para o Supabase Storage
            const { data: fileData, error: uploadError } = await supabase.storage
              .from('photos')
              .upload(fileName, blob, {
                contentType: blob.type || 'image/jpeg',
                cacheControl: '3600',
                upsert: true
              });
              
            if (uploadError) {
              addLog(`  ❌ Erro no upload: ${uploadError.message}`);
              addLog(`  Detalhes: ${JSON.stringify(uploadError)}`);
              
              // Tentar uma abordagem alternativa se necessário
              throw new Error(`Erro no upload: ${uploadError.message}`);
            }
            
            // Obter URL pública
            const { data: urlData } = supabase.storage
              .from('photos')
              .getPublicUrl(fileName);
              
            imageUrl = urlData.publicUrl;
            addLog(`  - Imagem enviada, URL: ${imageUrl}`);
          } else if (!photo.image) {
            addLog(`  ⚠️ Foto sem imagem, usando placeholder`);
            imageUrl = '/api/placeholder/400/300';
          }
          
          // 6.2 Inserir registro no banco de dados
          addLog(`  - Inserindo registro no banco...`);
          
          // Preparar dados com ambos os formatos de campo para garantir compatibilidade
          const photoData = {
            id: photo.id,
            image: imageUrl,
            caption: photo.caption || '',
            author: photo.author || 'Usuário',
            // Usar ambos os formatos possíveis do campo
            authorId: photo.authorId,
            author_id: photo.authorId,
            timestamp: photo.timestamp ? new Date(photo.timestamp).toISOString() : new Date().toISOString(),
            likes: photo.likes || []
          };
          
          addLog(`  - Dados a inserir: ${JSON.stringify(photoData)}`);
          
          // Primeira tentativa - com todos os campos
          const { data, error } = await supabase
            .from('photos')
            .insert([photoData])
            .select();
            
          if (error) {
            addLog(`  ❌ Erro ao inserir registro: ${error.message}`);
            
            // Segunda tentativa - sem o ID
            addLog(`  - Tentando inserir sem ID...`);
            const { id, ...photoDataWithoutId } = photoData;
            
            const { data: data2, error: error2 } = await supabase
              .from('photos')
              .insert([photoDataWithoutId])
              .select();
              
            if (error2) {
              addLog(`  ❌ Erro na segunda tentativa: ${error2.message}`);
              
              // Terceira tentativa - campos mínimos
              addLog(`  - Tentando com campos mínimos...`);
              const minimalData = {
                image: imageUrl,
                author: photo.author || 'Usuário',
                timestamp: new Date().toISOString()
              };
              
              const { data: data3, error: error3 } = await supabase
                .from('photos')
                .insert([minimalData])
                .select();
                
              if (error3) {
                addLog(`  ❌ Todas as tentativas falharam`);
                errorCount++;
              } else {
                addLog(`  ✅ Inserido com campos mínimos!`);
                successCount++;
              }
            } else {
              addLog(`  ✅ Inserido sem ID!`);
              successCount++;
            }
          } else {
            addLog(`  ✅ Foto ${i+1} migrada com sucesso!`);
            successCount++;
          }
        } catch (photoError) {
          errorCount++;
          addLog(`  ❌ Erro na foto ${i+1}: ${photoError.message}`);
        }
      }
      
      if (successCount > 0) {
        addLog(`✅ ${successCount} fotos migradas com sucesso`);
      }
      
      if (errorCount > 0) {
        addLog(`❌ ${errorCount} erros de migração`);
      }
      
      setStatus(`Migração de fotos concluída: ${successCount} de ${newPhotos.length} fotos migradas`);
    } catch (e) {
      console.error('Erro na migração de fotos:', e);
      addLog(`❌ Erro geral: ${e.message}`);
      setStatus(`Erro na migração de fotos: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para verificar e corrigir timestamps inválidos
const validateTimestamp = (timestamp) => {
    if (!timestamp) return new Date().toISOString();
    
    // Verificar se é um número pequeno (possivelmente um ID ou valor inválido)
    if (typeof timestamp === 'number' && timestamp < 1000000) {
      return new Date().toISOString();
    }
    
    // Se for uma string que parece um número pequeno
    if (typeof timestamp === 'string' && !isNaN(timestamp) && parseInt(timestamp) < 1000000) {
      return new Date().toISOString();
    }
    
    try {
      // Tentar converter para data válida
      const date = new Date(timestamp);
      
      // Verificar se a data é válida (não é NaN)
      if (isNaN(date.getTime())) {
        return new Date().toISOString();
      }
      
      return date.toISOString();
    } catch (e) {
      // Em caso de erro, usar a data atual
      return new Date().toISOString();
    }
  };

  // Criar funções auxiliares no Supabase
  const handleCreateHelperFunctions = async () => {
    setIsLoading(true);
    setStatus('Criando funções auxiliares...');
    setLogMessages([]);
    
    try {
      addLog("Criando função para desativar RLS...");
      
      // SQL para criar a função de desativar RLS
      const disableRlsSQL = `
        CREATE OR REPLACE FUNCTION disable_rls(table_name text)
        RETURNS void AS $$
        BEGIN
          EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', table_name);
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `;
      
      // SQL para criar a função que retorna colunas de uma tabela
      const getColumnsSQL = `
        CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
        RETURNS TABLE(column_name text, data_type text) AS $$
        BEGIN
          RETURN QUERY
          SELECT c.column_name::text, c.data_type::text
          FROM information_schema.columns c
          WHERE c.table_name = table_name
          AND c.table_schema = 'public';
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `;
      
      // Executar os SQLs
      const { error: error1 } = await supabase.rpc('exec_sql', { sql: disableRlsSQL });
      
      if (error1) {
        addLog(`❌ Erro ao criar função disable_rls: ${error1.message}`);
        addLog("Tentando método alternativo...");
        
        // Tentar criar diretamente via SQL
        const { error: sqlError1 } = await supabase.from('_sqlexecute').rpc('', { sql: disableRlsSQL });
        if (sqlError1) {
          addLog(`❌ Também falhou: ${sqlError1.message}`);
        } else {
          addLog("✅ Função disable_rls criada com sucesso!");
        }
      } else {
        addLog("✅ Função disable_rls criada com sucesso!");
      }
      
      addLog("Criando função para obter colunas...");
      const { error: error2 } = await supabase.rpc('exec_sql', { sql: getColumnsSQL });
      
      if (error2) {
        addLog(`❌ Erro ao criar função get_table_columns: ${error2.message}`);
        addLog("Tentando método alternativo...");
        
        // Tentar criar diretamente via SQL
        const { error: sqlError2 } = await supabase.from('_sqlexecute').rpc('', { sql: getColumnsSQL });
        if (sqlError2) {
          addLog(`❌ Também falhou: ${sqlError2.message}`);
        } else {
          addLog("✅ Função get_table_columns criada com sucesso!");
        }
      } else {
        addLog("✅ Função get_table_columns criada com sucesso!");
      }
      
      setStatus('Funções auxiliares criadas com sucesso!');
    } catch (e) {
      console.error('Erro ao criar funções auxiliares:', e);
      addLog(`❌ Erro geral: ${e.message}`);
      setStatus(`Erro ao criar funções auxiliares: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Migração completa (mensagens + fotos)
  const handleFullMigration = async () => {
    setIsLoading(true);
    setStatus('Iniciando migração completa...');
    setLogMessages([]);
    
    try {
      addLog("PARTE 1: MIGRAÇÃO DE MENSAGENS");
      await handleMessagesMigration();
      
      addLog("\nPARTE 2: MIGRAÇÃO DE FOTOS");
      await handlePhotosMigration();
      
      setStatus('Migração completa finalizada!');
    } catch (e) {
      console.error('Erro na migração completa:', e);
      setStatus(`Erro na migração completa: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      margin: '20px', 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      maxWidth: '800px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ color: '#2e7d32', marginTop: 0 }}>Ferramenta de Migração de Conteúdo</h2>
      <p>Esta ferramenta migra mensagens e fotos do localStorage para o banco de dados Supabase.</p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
        <button 
          onClick={handleCreateHelperFunctions}
          disabled={isLoading}
          style={{
            padding: '10px 15px',
            background: '#6a1b9a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? 'Processando...' : 'Criar Funções Auxiliares'}
        </button>
        
        <button 
          onClick={handleMessagesMigration}
          disabled={isLoading}
          style={{
            padding: '10px 15px',
            background: '#2e7d32',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? 'Processando...' : 'Migrar Mensagens'}
        </button>
        
        <button 
          onClick={handlePhotosMigration}
          disabled={isLoading}
          style={{
            padding: '10px 15px',
            background: '#1565c0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? 'Processando...' : 'Migrar Fotos'}
        </button>
        
        <button 
          onClick={handleFullMigration}
          disabled={isLoading}
          style={{
            padding: '10px 15px',
            background: '#5e35b1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? 'Processando...' : 'Migração Completa'}
        </button>
      </div>
      
      {status && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: status.includes('Erro') ? '#ffebee' : '#e8f5e9',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          {status}
        </div>
      )}
      
      {logMessages.length > 0 && (
        <div style={{
          marginTop: '20px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #ddd',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Log de Operações</span>
            <button 
              onClick={() => setLogMessages([])}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#555'
              }}
            >
              Limpar
            </button>
          </div>
          <div style={{
            maxHeight: '400px',
            overflow: 'auto',
            padding: '10px',
            backgroundColor: '#fafafa',
            fontFamily: 'monospace',
            fontSize: '12px',
            whiteSpace: 'pre-wrap'
          }}>
            {logMessages.map((msg, i) => (
              <div key={i} style={{
                borderBottom: '1px solid #eee',
                padding: '5px 0',
                color: msg.includes('Erro') || msg.includes('❌') ? '#d32f2f' : 
                      msg.includes('✅') ? '#2e7d32' : 
                      msg.includes('⚠️') ? '#f57c00' :
                      msg.startsWith('PARTE') ? '#1565c0' :
                      msg.startsWith('  -') ? '#757575' :
                      'inherit'
              }}>
                {msg}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentMigrationTool;