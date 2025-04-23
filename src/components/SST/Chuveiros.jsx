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
  Paper,
  Tooltip
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import ShowerIcon from '@mui/icons-material/Shower';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { STEPS } from './config';

const Chuveiros = ({ handleBackToAreasVivencia, handleNextPage, dadosIniciais = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fileInputRef = useRef(null);

  // Estado para os radio buttons
  const [respostas, setRespostas] = useState(dadosIniciais || {
    chuveirosDivisao: '',
    chuveirosSuportes: '',
    chuveirosParede: '',
    chuveirosConservacao: ''
  });

  // Função para lidar com mudanças nos radio buttons
  const handleRadioChange = (event) => {
    setRespostas({
      ...respostas,
      [event.target.name]: event.target.value
    });
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
        respostasChuveiros: respostas
      };
      
      if (handleNextPage) {
        handleNextPage(dados);
      }
    }
  };

  // Função para limpar o formulário
  const limparFormulario = () => {
    setRespostas({
      chuveirosDivisao: '',
      chuveirosSuportes: '',
      chuveirosParede: '',
      chuveirosConservacao: ''
    });
  };
  
  // Função para abrir o seletor de arquivos
  const handleUploadClick = () => {
    fileInputRef.current.click();
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
                  Avalie as condições dos chuveiros no canteiro de obras. Chuveiros adequados
                  são essenciais para garantir a higiene e bem-estar dos trabalhadores nas
                  áreas de vivência.
                </Typography>
                
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
                  Processo de Avaliação:
                </Typography>
                
                <Stepper activeStep={4} orientation="vertical" sx={{ mb: 3 }}>
                  {STEPS.map((label) => (
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
                CHUVEIROS
              </Typography>
              <Typography variant="subtitle1">
                Avaliação das condições dos chuveiros no canteiro de obras
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
                    <ShowerIcon sx={{ mr: 1 }} /> Instalações de Chuveiros
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                    Avalie as condições dos chuveiros disponíveis para os trabalhadores.
                  </Typography>
                </Grid>
              </Grid>

              {/* Perguntas sobre chuveiros */}
              <Questao 
                numero="27"
                texto="Os chuveiros possuem divisão por sexo e compartimentos individuais com o seu interior indevessável?"
                name="chuveirosDivisao"
                value={respostas.chuveirosDivisao}
              />
              
              <Questao 
                numero="28"
                texto="Estão providos com fecho, suporte para toalha e saboneteira?"
                name="chuveirosSuportes"
                value={respostas.chuveirosSuportes}
              />
              
              <Questao 
                numero="29"
                texto="São individuais com parede impermeável, lavavel com água quente e fria?"
                name="chuveirosParede"
                value={respostas.chuveirosParede}
              />
              
              <Questao 
                numero="30"
                texto="Os chuveiros são mantidos em condição de conservação e limpeza?"
                name="chuveirosConservacao"
                value={respostas.chuveirosConservacao}
              />

              {/* Input de arquivo escondido */}
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={() => {}} // Pode ser conectado ao mesmo sistema de upload de arquivos da página anterior
                style={{ display: 'none' }}
              />

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
                        onClick={handleBackToAreasVivencia}
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

export default Chuveiros;