import React, { useState, useRef } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Grid,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Divider,
  Card,
  CardContent,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
  TextField,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Grow,
  Tooltip
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';

const DocumentacaoLegal = ({ handleBackToForm, handleNextPage, dadosIniciais = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fileInputRef = useRef(null);

  // Estado para os radio buttons
  const [respostas, setRespostas] = useState(dadosIniciais || {
    comunicacaoInicio: '',
    pgrElaborado: '',
    pgrProfissional: '',
    pgrEPI: '',
    pgrProjetos: '',
    pcmsoElaborado: '',
    asosDias: '',
    vacinasEmDia: '',
    planilhaVacina: '',
    ltcatElaborado: '',
    ltcatNR15: '',
    pgrccElaborado: ''
  });

  // Estado para observações
  const [observacoes, setObservacoes] = useState('');
  
  // Estado para os arquivos
  const [arquivos, setArquivos] = useState([]);
  
  // Estado para exibir feedback sobre o upload
  const [uploadFeedback, setUploadFeedback] = useState({
    show: false,
    message: '',
    tipo: 'success'
  });

  // Etapas do processo
  const steps = ['Identificação da Obra', 'Documentação Legal', 'Projetos', 'Áreas de Vivência', 'Chuveiros', 'Vestiários', 'Resultados'];


  // Função para lidar com mudanças nos radio buttons
  const handleRadioChange = (event) => {
    setRespostas({
      ...respostas,
      [event.target.name]: event.target.value
    });
  };

  // Função para lidar com mudanças no campo de observações
  const handleObservacoesChange = (event) => {
    setObservacoes(event.target.value);
  };

  // Verificar se todos os campos estão preenchidos
  const isFormCompleto = () => {
    return Object.values(respostas).every(valor => valor !== '');
  };

  // Função para avançar para a próxima etapa
  const handleAvancar = () => {
    if (isFormCompleto()) {
      console.log("Avançando para a próxima etapa com respostas:", respostas);
      
      // Dados a serem passados para a próxima etapa
      const dados = {
        respostasDocumentacao: respostas,
        observacoes: observacoes,
        evidencias: arquivos
      };
      
      if (handleNextPage) {
        handleNextPage(dados);
      }
    }
  };

  // Função para limpar o formulário
  const limparFormulario = () => {
    setRespostas({
      comunicacaoInicio: '',
      pgrElaborado: '',
      pgrProfissional: '',
      pgrEPI: '',
      pgrProjetos: '',
      pcmsoElaborado: '',
      asosDias: '',
      vacinasEmDia: '',
      planilhaVacina: '',
      ltcatElaborado: '',
      ltcatNR15: '',
      pgrccElaborado: ''
    });
    setObservacoes('');
    setArquivos([]);
  };
  
  // Função para abrir o seletor de arquivos
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  // Função para lidar com a seleção de arquivos
  const handleFileSelect = (event) => {
    const novosArquivos = Array.from(event.target.files);
    
    if (novosArquivos.length > 0) {
      // Verificar se o total de arquivos não excede 10
      if (arquivos.length + novosArquivos.length > 10) {
        setUploadFeedback({
          show: true,
          message: 'Você pode enviar no máximo 10 arquivos.',
          tipo: 'error'
        });
        
        // Esconder a mensagem depois de 3 segundos
        setTimeout(() => {
          setUploadFeedback({ show: false, message: '', tipo: 'success' });
        }, 3000);
        
        return;
      }
      
      // Verificar o tamanho de cada arquivo (limite de 100MB)
      const tamanhoMaximo = 100 * 1024 * 1024; // 100MB em bytes
      const arquivosValidos = novosArquivos.filter(arquivo => arquivo.size <= tamanhoMaximo);
      
      if (arquivosValidos.length < novosArquivos.length) {
        setUploadFeedback({
          show: true,
          message: 'Alguns arquivos excedem o limite de 100MB e foram ignorados.',
          tipo: 'warning'
        });
        
        // Esconder a mensagem depois de 3 segundos
        setTimeout(() => {
          setUploadFeedback({ show: false, message: '', tipo: 'success' });
        }, 3000);
      }
      
      if (arquivosValidos.length > 0) {
        setArquivos([...arquivos, ...arquivosValidos]);
        setUploadFeedback({
          show: true,
          message: `${arquivosValidos.length} arquivos adicionados com sucesso.`,
          tipo: 'success'
        });
        
        // Esconder a mensagem depois de 3 segundos
        setTimeout(() => {
          setUploadFeedback({ show: false, message: '', tipo: 'success' });
        }, 3000);
      }
    }
    
    // Limpar o valor do input para permitir o upload do mesmo arquivo novamente
    event.target.value = '';
  };
  
  // Função para remover um arquivo
  const handleRemoveFile = (index) => {
    const novosArquivos = [...arquivos];
    novosArquivos.splice(index, 1);
    setArquivos(novosArquivos);
  };
  
  // Função para obter o ícone correto para cada tipo de arquivo
  const getFileIcon = (arquivo) => {
    const tipoArquivo = arquivo.type;
    
    if (tipoArquivo.includes('pdf')) {
      return <PictureAsPdfIcon color="error" />;
    } else if (tipoArquivo.includes('image')) {
      return <ImageIcon color="primary" />;
    } else {
      return <InsertDriveFileIcon color="action" />;
    }
  };
  
  // Função para formatar o tamanho do arquivo
  const formatFileSize = (size) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };
  
  // Componente de questão padrão com radio buttons
  const Questao = ({ numero, texto, name, value }) => (
    <Paper 
      elevation={value ? 2 : 1} 
      sx={{ 
        mb: 3, 
        p: 2, 
        bgcolor: value ? 
          (value === 'CONFORME' ? 'rgba(76, 175, 80, 0.07)' : 
           value === 'NÃO CONFORME' ? 'rgba(244, 67, 54, 0.07)' : 
           'rgba(255, 193, 7, 0.07)') : 
          'background.paper',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        border: value ? 
          (value === 'CONFORME' ? '1px solid rgba(76, 175, 80, 0.3)' : 
           value === 'NÃO CONFORME' ? '1px solid rgba(244, 67, 54, 0.3)' : 
           '1px solid rgba(255, 193, 7, 0.3)') : 
          '1px solid rgba(0, 0, 0, 0.1)',
        '&:hover': {
          boxShadow: 3
        }
      }}
    >
      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend" sx={{ 
          display: 'flex',
          alignItems: 'flex-start',
          color: 'text.primary',
          fontWeight: 500,
          mb: 1,
          '&.Mui-focused': { color: 'text.primary' }
        }}>
          <Typography component="span" sx={{ fontWeight: 'bold', mr: 1 }}>{numero}</Typography>
          <Typography component="span">{texto}</Typography>
        </FormLabel>
        <RadioGroup
          row
          name={name}
          value={value}
          onChange={handleRadioChange}
          sx={{ justifyContent: 'space-between', mt: 1 }}
        >
          <FormControlLabel 
            value="CONFORME" 
            control={
              <Radio 
                icon={<CheckCircleIcon sx={{ fontSize: 22 }} />}
                checkedIcon={<CheckCircleIcon sx={{ fontSize: 24 }} />}
                sx={{ 
                  color: 'rgba(0, 150, 0, 0.5)',
                  '&.Mui-checked': { 
                    color: 'success.main',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease'
                }}
              />
            } 
            label={
              <Typography 
                sx={{ 
                  fontWeight: value === 'CONFORME' ? 'bold' : 'normal',
                  color: value === 'CONFORME' ? 'success.main' : 'inherit'
                }}
              >
                CONFORME
              </Typography>
            }
            sx={{ 
              mr: 2,
              opacity: value === 'CONFORME' ? 1 : 0.8
            }}
          />
          <FormControlLabel 
            value="NÃO CONFORME" 
            control={
              <Radio 
                icon={<CancelIcon sx={{ fontSize: 22 }} />}
                checkedIcon={<CancelIcon sx={{ fontSize: 24 }} />}
                sx={{ 
                  color: 'rgba(150, 0, 0, 0.5)',
                  '&.Mui-checked': { 
                    color: 'error.main',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease'
                }}
              />
            } 
            label={
              <Typography 
                sx={{ 
                  fontWeight: value === 'NÃO CONFORME' ? 'bold' : 'normal',
                  color: value === 'NÃO CONFORME' ? 'error.main' : 'inherit'
                }}
              >
                NÃO CONFORME
              </Typography>
            }
            sx={{ 
              mr: 2, 
              opacity: value === 'NÃO CONFORME' ? 1 : 0.8 
            }}
          />
          <FormControlLabel 
            value="NÃO SE APLICA" 
            control={
              <Radio 
                icon={<HelpIcon sx={{ fontSize: 22 }} />}
                checkedIcon={<HelpIcon sx={{ fontSize: 24 }} />}
                sx={{ 
                  color: 'rgba(150, 150, 0, 0.5)',
                  '&.Mui-checked': { 
                    color: 'warning.main',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease'
                }}
              />
            } 
            label={
              <Typography 
                sx={{ 
                  fontWeight: value === 'NÃO SE APLICA' ? 'bold' : 'normal',
                  color: value === 'NÃO SE APLICA' ? 'warning.main' : 'inherit'
                }}
              >
                NÃO SE APLICA
              </Typography>
            }
            sx={{ 
              opacity: value === 'NÃO SE APLICA' ? 1 : 0.8 
            }}
          />
        </RadioGroup>
      </FormControl>
      
      {/* Mensagem com sugestão para anexar evidência quando marcado "Não Conforme" */}
      {value === 'NÃO CONFORME' && (
        <Box sx={{ 
          mt: 2, 
          p: 1, 
          bgcolor: 'rgba(244, 67, 54, 0.1)', 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          <CancelIcon 
            fontSize="small" 
            color="error" 
            sx={{ mr: 1 }} 
          />
          <Typography variant="body2" color="error.main">
            Recomendado anexar evidência para este item não conforme
          </Typography>
          <Button 
            size="small" 
            startIcon={<AttachFileIcon />}
            onClick={handleUploadClick}
            sx={{ ml: 'auto' }}
          >
            Anexar
          </Button>
        </Box>
      )}
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ pt: 14, pb: 8 }}>
      <Grid container spacing={4}>
        {/* Coluna da esquerda - apenas para desktop */}
        {!isMobile && (
          <Grid item xs={12} md={4} lg={3}>
            <Card 
              elevation={3} 
              sx={{ 
                height: '100%', 
                bgcolor: '#f8f9fa',
                borderRadius: 2,
                position: 'sticky',
                top: 100
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: theme.palette.primary.main, 
                      width: 56, 
                      height: 56,
                      mr: 2 
                    }}
                  >
                    <SecurityIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    Índice SST
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                  Verifique cuidadosamente cada item da documentação legal. 
                  A conformidade com essas normas é essencial para a segurança dos 
                  trabalhadores e para evitar possíveis sanções legais.
                </Typography>
                
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
                  Processo de Avaliação:
                </Typography>
                
                <Stepper activeStep={1} orientation="vertical" sx={{ mb: 3 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                
                <Divider sx={{ mb: 3 }} />
                
                <Typography variant="caption" color="text.secondary">
                  Observe que todos os campos marcados com asterisco (*) são obrigatórios.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
        
        {/* Coluna principal do formulário */}
        <Grid item xs={12} md={8} lg={9}>
          <Card elevation={4} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {/* Cabeçalho com cor de fundo */}
            <Box sx={{ 
              bgcolor: theme.palette.primary.main, 
              py: 4, 
              px: 3,
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '40%',
                height: '100%',
                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1))',
                transform: 'skewX(-20deg) translateX(10%)'
              }} />
              
              <Typography 
                variant="h4" 
                component="h1" 
                fontWeight="bold" 
                sx={{ mb: 1 }}
              >
                DOCUMENTAÇÃO LEGAL
              </Typography>
              <Typography variant="subtitle1">
                Verificação de conformidade com normas e requisitos legais
              </Typography>
            </Box>
            
            {/* Conteúdo do formulário */}
            <Box sx={{ p: 4 }}>
              <Grid container spacing={1} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                  <Typography variant="h5" component="h2" fontWeight="bold" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: theme.palette.primary.main
                    }}
                  >
                    <DescriptionIcon sx={{ mr: 1 }} /> Requisitos de Documentação
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                    Avalie os seguintes itens de documentação legal, classificando cada um como conforme, 
                    não conforme ou não aplicável.
                  </Typography>
                </Grid>
              </Grid>

              {/* Perguntas sobre documentação legal */}
              <Questao 
                numero="1"
                texto="Comunicação de início de obra foi realizado?"
                name="comunicacaoInicio"
                value={respostas.comunicacaoInicio}
              />
              
              <Questao 
                numero="2"
                texto="PGR elaborado e implantado na obra?"
                name="pgrElaborado"
                value={respostas.pgrElaborado}
              />
              
              <Questao 
                numero="3"
                texto="O PGR foi elaborado por profissional legalmente habilitado?"
                name="pgrProfissional"
                value={respostas.pgrProfissional}
              />
              
              <Questao 
                numero="4"
                texto="O PGR possui a relação de EPI e especificações técnicas?"
                name="pgrEPI"
                value={respostas.pgrEPI}
              />
              
              <Questao 
                numero="5"
                texto="O PGR possui os projetos de segurança do canteiro?"
                name="pgrProjetos"
                value={respostas.pgrProjetos}
              />
              
              <Questao 
                numero="6"
                texto="PCMSO foi elaborado e implantado na obra?"
                name="pcmsoElaborado"
                value={respostas.pcmsoElaborado}
              />
              
              <Questao 
                numero="7"
                texto="Os ASO's estão dias?"
                name="asosDias"
                value={respostas.asosDias}
              />
              
              <Questao 
                numero="8"
                texto="As Vacinas dos colaboradores estão em dia?"
                name="vacinasEmDia"
                value={respostas.vacinasEmDia}
              />
              
              <Questao 
                numero="9"
                texto="A planilha de controle de vacina está atualizado?"
                name="planilhaVacina"
                value={respostas.planilhaVacina}
              />
              
              <Questao 
                numero="10"
                texto="LTCAT elaborado com as medições quantitativas e implantados na obra?"
                name="ltcatElaborado"
                value={respostas.ltcatElaborado}
              />
              
              <Questao 
                numero="11"
                texto="O parecer técnico do LTCAT está embasado na NR 15 atividades e operações insalubres?"
                name="ltcatNR15"
                value={respostas.ltcatNR15}
              />
              
              <Questao 
                numero="12"
                texto="PGRCC elaborado e implantado na obra?"
                name="pgrccElaborado"
                value={respostas.pgrccElaborado}
              />

              {/* Campo para observações */}
              <Box sx={{ mb: 4, mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>Observações:</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Insira aqui suas observações sobre a documentação legal..."
                  value={observacoes}
                  onChange={handleObservacoesChange}
                />
              </Box>
              
              {/* Área para upload de evidências */}
              <Paper sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, position: 'relative' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    Evidências:
                  </Typography>
                  
                  <Chip 
                    label={`${arquivos.length}/10 arquivos`} 
                    color={arquivos.length === 10 ? "warning" : "primary"} 
                    size="small" 
                    variant="outlined"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Faça upload de até 10 arquivos. O tamanho máximo é de 100 MB por item.
                </Typography>
                
                {/* Botão de upload e input file escondido */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    p: 4,
                    border: '2px dashed rgba(0, 0, 0, 0.1)',
                    borderRadius: 2,
                    cursor: 'pointer',
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                      borderColor: 'rgba(0, 0, 0, 0.2)'
                    },
                    mb: 2
                  }}
                  onClick={handleUploadClick}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <FileUploadIcon 
                      sx={{ 
                        fontSize: 48, 
                        color: 'primary.main', 
                        opacity: 0.7,
                        mb: 1
                      }} 
                    />
                    <Typography>
                      Arraste arquivos aqui ou clique para selecionar
                    </Typography>
                  </Box>
                  
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </Box>
                
                {/* Feedback de upload */}
                <Grow in={uploadFeedback.show}>
                  <Box sx={{ 
                    mb: 2, 
                    textAlign: 'center', 
                    color: uploadFeedback.tipo === 'success' ? 'success.main' : 
                          uploadFeedback.tipo === 'warning' ? 'warning.main' : 'error.main' 
                  }}>
                    <Typography variant="body2">{uploadFeedback.message}</Typography>
                  </Box>
                </Grow>
                
                {/* Lista de arquivos */}
                {arquivos.length > 0 && (
                  <Paper variant="outlined" sx={{ mt: 2 }}>
                    <List dense>
                      {arquivos.map((arquivo, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            {getFileIcon(arquivo)}
                          </ListItemIcon>
                          <ListItemText 
                            primary={arquivo.name} 
                            secondary={formatFileSize(arquivo.size)} 
                          />
                          <ListItemSecondaryAction>
                            <Tooltip title="Remover arquivo">
                              <IconButton 
                                edge="end" 
                                onClick={() => handleRemoveFile(index)}
                                size="small"
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
              </Paper>

              {/* Linha divisória antes dos botões */}
              <Divider sx={{ my: 3 }} />

              {/* Botões */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    gap: 2
                  }}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button 
                        variant="outlined" 
                        onClick={handleBackToForm}
                        startIcon={<ArrowBackIcon />}
                        sx={{ 
                          borderRadius: 2,
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                          '&:hover': {
                            borderColor: theme.palette.primary.dark,
                            bgcolor: 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                      >
                        Voltar
                      </Button>
                      <Button 
                        variant="contained" 
                        onClick={handleAvancar}
                        endIcon={<ArrowForwardIcon />}
                        disabled={!isFormCompleto()}
                        sx={{ 
                          borderRadius: 2,
                          px: 3,
                          bgcolor: theme.palette.primary.main,
                          '&:hover': {
                            bgcolor: theme.palette.primary.dark
                          },
                          '&.Mui-disabled': {
                            bgcolor: 'rgba(0, 0, 0, 0.12)'
                          }
                        }}
                      >
                        Próxima Etapa
                      </Button>
                    </Box>
                    <Button 
                      variant="text" 
                      onClick={limparFormulario}
                      startIcon={<RestartAltIcon />}
                      sx={{ 
                        color: 'text.secondary',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      Limpar Dados
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Card>
          
          {/* Rodapé com informações de copyright */}
          <Box mt={3} textAlign="center">
            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} TOP Construtora. Todos os direitos reservados.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DocumentacaoLegal;