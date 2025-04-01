// src/services/photoFeedService.js
import supabase from '../supabase/client';
import authService from './authService';

// Chave para armazenamento no localStorage (para compatibilidade)
const PHOTO_STORAGE_KEY = 'photo_feed_data';

// Inicializar o storage se não existir
const initializeLocalStorage = () => {
  if (!localStorage.getItem(PHOTO_STORAGE_KEY)) {
    localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify([]));
  }
};

// Inicializa o banco de dados do Supabase se necessário
const initializeSupabaseData = async () => {
  try {
    // Verifica se já existem fotos no Supabase
    const { data: existingPhotos, error: checkError } = await supabase
      .from('photos')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Erro ao verificar fotos existentes:', checkError);
      return;
    }

    // Se não existirem fotos, migra do localStorage
    if (!existingPhotos || existingPhotos.length === 0) {
      console.log('Verificando fotos no localStorage para migrar...');
      
      // Carrega fotos do localStorage para migrar
      initializeLocalStorage();
      const localPhotos = JSON.parse(localStorage.getItem(PHOTO_STORAGE_KEY) || '[]');
      
      if (localPhotos.length > 0) {
        console.log(`Migrando ${localPhotos.length} fotos para o Supabase...`);
        
        // Para cada foto, faz upload da imagem e insere o registro
        for (const photo of localPhotos) {
          try {
            // Extrai os dados da imagem (se for base64)
            let imageFile = photo.image;
            
            // Verifica se é uma URL ou base64
            if (imageFile.startsWith('data:')) {
              // Converter base64 para blob
              const fetchResponse = await fetch(imageFile);
              imageFile = await fetchResponse.blob();
            }
            
            // Gera um nome de arquivo único
            const fileName = `photo_${Date.now()}_${photo.id}`;
            
            // Faz upload da imagem
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('photos')
              .upload(fileName, imageFile);
              
            if (uploadError) {
              console.error(`Erro ao fazer upload da foto ${photo.id}:`, uploadError);
              continue;
            }
            
            // Obtém a URL pública da imagem
            const { data: urlData } = supabase.storage
              .from('photos')
              .getPublicUrl(fileName);
              
            const imageUrl = urlData.publicUrl;
            
            // Insere o registro no banco
            await supabase
              .from('photos')
              .insert([{
                ...photo,
                image: imageUrl,
                author_id: photo.authorId // Ajusta o nome do campo conforme o schema
              }]);
              
            console.log(`Foto ${photo.id} migrada com sucesso`);
          } catch (err) {
            console.error(`Erro ao migrar foto ${photo.id}:`, err);
          }
        }
      }
    }
  } catch (error) {
    console.error('Erro ao inicializar banco de dados de fotos:', error);
  }
};

// Serviço para gerenciar o feed de fotos
const photoFeedService = {
  // Inicializa o banco de dados
  initDatabase: async () => {
    initializeLocalStorage();
    await initializeSupabaseData();
  },
  
  // Obter todas as fotos
  getPhotos: async () => {
    try {
      // Primeiro tenta buscar do Supabase
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('timestamp', { ascending: false });
        
      if (error) {
        console.error('Erro ao obter fotos do Supabase:', error);
        
        // Fallback para localStorage
        initializeLocalStorage();
        try {
          const photos = JSON.parse(localStorage.getItem(PHOTO_STORAGE_KEY) || '[]');
          return photos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } catch (localError) {
          console.error('Erro ao obter fotos do localStorage:', localError);
          return [];
        }
      }
      
      return data || [];
    } catch (error) {
      console.error('Erro ao obter fotos:', error);
      
      // Fallback para localStorage em caso de erro
      initializeLocalStorage();
      try {
        const photos = JSON.parse(localStorage.getItem(PHOTO_STORAGE_KEY) || '[]');
        return photos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      } catch (localError) {
        console.error('Erro ao obter fotos do localStorage:', localError);
        return [];
      }
    }
  },
  
  // Adicionar uma nova foto
  addPhoto: async (imageData, caption) => {
    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('Apenas administradores podem adicionar fotos');
      }
      
      // Upload da imagem para o Supabase Storage
      const fileName = `photo_${Date.now()}`;
      const contentType = 'image/jpeg'; // Ajuste conforme necessário
      
      // Faz upload da imagem
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, imageData, {
          contentType: contentType,
          cacheControl: '3600'
        });
      
      if (uploadError) {
        console.error('Erro ao fazer upload da imagem:', uploadError);
        throw uploadError;
      }
      
      // Obter URL pública da imagem
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);
      
      const imageUrl = urlData.publicUrl;
      
      // Criar objeto da nova foto
      const newPhoto = {
        image: imageUrl,
        caption: caption,
        author: currentUser.name || currentUser.username,
        author_id: currentUser.id,
        timestamp: new Date().toISOString(),
        likes: []
      };
      
      // Salvar os dados da foto no Supabase
      const { data, error } = await supabase
        .from('photos')
        .insert([newPhoto])
        .select();
        
      if (error) {
        console.error('Erro ao adicionar foto no Supabase:', error);
        
        // Fallback para localStorage
        initializeLocalStorage();
        const photos = JSON.parse(localStorage.getItem(PHOTO_STORAGE_KEY) || '[]');
        const newId = photos.length > 0 ? Math.max(...photos.map(p => p.id)) + 1 : 1;
        
        const photoWithId = {
          ...newPhoto,
          id: newId,
          authorId: currentUser.id // Para compatibilidade
        };
        
        photos.unshift(photoWithId);
        localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(photos));
        
        return photoWithId;
      }
      
      return data[0];
    } catch (error) {
      console.error('Erro ao adicionar foto:', error);
      throw error;
    }
  },
  
  // Remover uma foto
  removePhoto: async (photoId) => {
    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('Apenas administradores podem remover fotos');
      }
      
      // Primeiro tenta remover do Supabase
      // Buscar detalhes da foto para obter o nome do arquivo de imagem
      const { data: photo, error: fetchError } = await supabase
        .from('photos')
        .select('*')
        .eq('id', photoId)
        .single();
      
      if (!fetchError && photo) {
        // Extrair o nome do arquivo da URL da imagem
        const fileName = photo.image.split('/').pop();
        
        // Tentar remover o arquivo do Storage
        try {
          await supabase.storage
            .from('photos')
            .remove([fileName]);
        } catch (storageError) {
          console.warn('Erro ao remover arquivo do storage:', storageError);
          // Continuamos mesmo se falhar a remoção do storage
        }
      }
      
      // Remover o registro do banco de dados
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId);
        
      if (error) {
        console.error('Erro ao remover foto do Supabase:', error);
        
        // Fallback para localStorage
        initializeLocalStorage();
        const photos = JSON.parse(localStorage.getItem(PHOTO_STORAGE_KEY) || '[]');
        const updatedPhotos = photos.filter(p => p.id !== photoId);
        localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(updatedPhotos));
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao remover foto:', error);
      throw error;
    }
  },
  
  // Curtir/descurtir uma foto
  toggleLike: async (photoId) => {
    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Você precisa estar logado para curtir fotos');
      }
      
      // Primeiro tenta atualizar no Supabase
      // Buscar a foto atual
      const { data: photo, error: fetchError } = await supabase
        .from('photos')
        .select('*')
        .eq('id', photoId)
        .single();
      
      if (fetchError) {
        console.error('Erro ao buscar foto do Supabase:', fetchError);
        
        // Fallback para localStorage
        initializeLocalStorage();
        const photos = JSON.parse(localStorage.getItem(PHOTO_STORAGE_KEY) || '[]');
        const photoIndex = photos.findIndex(p => p.id === photoId);
        
        if (photoIndex === -1) {
          throw new Error('Foto não encontrada');
        }
        
        const photo = photos[photoIndex];
        const likes = photo.likes || [];
        const userLikeIndex = likes.indexOf(currentUser.id);
        
        if (userLikeIndex === -1) {
          // Adicionar curtida
          likes.push(currentUser.id);
        } else {
          // Remover curtida
          likes.splice(userLikeIndex, 1);
        }
        
        photos[photoIndex] = { ...photo, likes };
        localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(photos));
        
        return photos[photoIndex];
      }
      
      // Se encontrou no Supabase, atualiza lá
      const likes = photo.likes || [];
      const userLikeIndex = likes.indexOf(currentUser.id);
      
      if (userLikeIndex === -1) {
        // Adicionar curtida
        likes.push(currentUser.id);
      } else {
        // Remover curtida
        likes.splice(userLikeIndex, 1);
      }
      
      // Atualizar no Supabase
      const { data, error } = await supabase
        .from('photos')
        .update({ likes })
        .eq('id', photoId)
        .select();
        
      if (error) {
        console.error('Erro ao atualizar curtidas no Supabase:', error);
        throw error;
      }
      
      return data[0];
    } catch (error) {
      console.error('Erro ao curtir/descurtir foto:', error);
      throw error;
    }
  },
  
  // Verificar se um usuário curtiu uma foto
  hasLiked: (photoId, userId, photos) => {
    try {
      if (!userId) return false;
      
      // Buscar a foto
      const photo = photos.find(p => p.id === photoId);
      
      if (!photo) return false;
      
      const likes = photo.likes || [];
      return likes.includes(userId);
    } catch (error) {
      console.error('Erro ao verificar curtida:', error);
      return false;
    }
  }
};

export default photoFeedService;