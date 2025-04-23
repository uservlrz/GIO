import React, { useState } from 'react';
import { Container, Paper, Typography, Button } from '@mui/material';
import FormularioSeguranca from './FormularioSeguranca';
import DocumentacaoLegal from './DocumentacaoLegal';
import Projetos from './Projetos';
import AreasVivencia from './AreasVivencia';
import Chuveiros from './Chuveiros';
import Vestiarios from './Vestiarios';
import LocalRefeicoes from './LocalRefeicoes';
import ControleSaudeOcupacional from './ControleSaudeOcupacional';
import ControleColaboradores from './ControleColaboradores';
import InstalacoesEletricas from './InstalacoesEletricas';
import { STEPS } from './config';

const FormularioSST = ({ handleBackToHome }) => {
  const [etapaAtual, setEtapaAtual] = useState(0);
  
  // Dados do formulário
  const [dadosFormulario, setDadosFormulario] = useState({
    // Identificação da obra
    obra: '',
    dataAvaliacao: null,
    avaliador: '',
    numColaboradores: '',
    
    // Documentação legal
    respostasDocumentacao: {},
    observacoes: '',
    evidencias: [],
    
    // Projetos
    respostasProjetos: {},
    
    // Áreas de Vivência
    respostasAreasVivencia: {},
    
    // Chuveiros
    respostasChuveiros: {},
    
    // Vestiários
    respostasVestiarios: {},
    
    // Local para Refeições
    respostasLocalRefeicoes: {},
    
    // Controle de Saúde Ocupacional
    respostasControleSaude: {},
    
    // Controle de Colaboradores
    respostasControleColaboradores: {},
    
    // Instalações Elétricas
    respostasInstalacoesEletricas: {}
  });
  
  // Funções para navegação entre etapas
  const avancarEtapa = (dados) => {
    console.log("Avançando para a próxima etapa com os dados:", dados);
    
    // Atualiza dados se necessário
    if (dados) {
      setDadosFormulario(prevState => ({
        ...prevState,
        ...dados
      }));
    }
    
    // Avança para a próxima etapa
    setEtapaAtual(prevEtapa => prevEtapa + 1);
  };
  
  const voltarEtapa = () => {
    console.log("Voltando para a etapa anterior");
    setEtapaAtual(prevEtapa => prevEtapa - 1);
  };
  
  // Renderiza a etapa atual
  const renderizarEtapa = () => {
    console.log("Renderizando a etapa:", etapaAtual);
    
    switch (etapaAtual) {
      case 0:
        return <FormularioSeguranca 
                 handleBackToHome={handleBackToHome} 
                 handleNextPage={avancarEtapa} 
                 dadosIniciais={dadosFormulario}
               />;
      case 1:
        return <DocumentacaoLegal 
                 handleBackToForm={voltarEtapa} 
                 handleNextPage={avancarEtapa}
                 dadosIniciais={dadosFormulario.respostasDocumentacao}
               />;
      case 2:
        return <Projetos 
                 handleBackToDocumentacao={voltarEtapa} 
                 handleNextPage={avancarEtapa}
                 dadosIniciais={dadosFormulario.respostasProjetos}
               />;
      case 3:
        return <AreasVivencia 
                 handleBackToProjetos={voltarEtapa} 
                 handleNextPage={avancarEtapa}
                 dadosIniciais={dadosFormulario.respostasAreasVivencia}
               />;
      case 4:
        return <Chuveiros 
                 handleBackToAreasVivencia={voltarEtapa} 
                 handleNextPage={avancarEtapa}
                 dadosIniciais={dadosFormulario.respostasChuveiros}
               />;
      case 5:
        return <Vestiarios 
                 handleBackToChuveiros={voltarEtapa} 
                 handleNextPage={avancarEtapa}
                 dadosIniciais={dadosFormulario.respostasVestiarios}
               />;
      case 6:
        return <LocalRefeicoes 
                 handleBackToVestiarios={voltarEtapa} 
                 handleNextPage={avancarEtapa}
                 dadosIniciais={dadosFormulario.respostasLocalRefeicoes}
               />;
      case 7:
        return <ControleSaudeOcupacional 
                 handleBackToLocalRefeicoes={voltarEtapa} 
                 handleNextPage={avancarEtapa}
                 dadosIniciais={dadosFormulario.respostasControleSaude}
               />;
      case 8:
        return <ControleColaboradores 
                 handleBackToControleSaude={voltarEtapa} 
                 handleNextPage={avancarEtapa}
                 dadosIniciais={dadosFormulario.respostasControleColaboradores}
               />;
      case 9:
        return <InstalacoesEletricas 
                 handleBackToControleColaboradores={voltarEtapa} 
                 handleNextPage={avancarEtapa}
                 dadosIniciais={dadosFormulario.respostasInstalacoesEletricas}
               />;
      case 10:
        // Tela de conclusão
        return (
          <Container maxWidth="md" sx={{ pt: 14, pb: 8, textAlign: 'center' }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h4" gutterBottom color="primary">
                Formulário Concluído!
              </Typography>
              <Typography variant="body1" paragraph>
                Todas as etapas do Índice de Saúde e Segurança no Trabalho foram preenchidas com sucesso.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleBackToHome}
                sx={{ mt: 2, borderRadius: 2 }}
              >
                Voltar ao Início
              </Button>
            </Paper>
          </Container>
        );
      default:
        // Se por algum motivo estiver em uma etapa inválida, volta para a primeira
        setEtapaAtual(0);
        return <FormularioSeguranca 
                handleBackToHome={handleBackToHome} 
                handleNextPage={avancarEtapa} 
                dadosIniciais={dadosFormulario}
              />;
    }
  };
  
  return renderizarEtapa();
};

export default FormularioSST;