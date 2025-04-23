import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
  Stack,
  Divider,
  Card,
  CardContent,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import SecurityIcon from '@mui/icons-material/Security';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { STEPS } from './config';

// Componente com props para navegação
const FormularioSeguranca = ({ handleBackToHome, handleNextPage, dadosIniciais = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Estados para controlar os valores dos campos
  const [obra, setObra] = useState(dadosIniciais.obra || '');
  const [dataAvaliacao, setDataAvaliacao] = useState(dadosIniciais.dataAvaliacao || dayjs());
  const [avaliador, setAvaliador] = useState(dadosIniciais.avaliador || '');
  const [numColaboradores, setNumColaboradores] = useState(dadosIniciais.numColaboradores || '');
  
  // Estado para controlar validação do formulário
  const [erros, setErros] = useState({
    obra: false,
    dataAvaliacao: false,
    avaliador: false,
    numColaboradores: false
  });

  // Lista de obras disponíveis
  const obras = [
    { value: 'IMPULSI', label: 'IMPULSI' },
    { value: 'VIDA', label: 'VIDA' },
    { value: 'TOM BUENO', label: 'TOM BUENO' },
    { value: 'BRAVIELLO', label: 'BRAVIELLO' },
    { value: 'SOLAR PLANALTO', label: 'SOLAR PLANALTO' },
    { value: 'AQUARELA', label: 'AQUARELA' },
    { value: 'LIBERTÁ', label: 'LIBERTÁ' },
    { value: 'BYD GOIÂNIA', label: 'BYD GOIÂNIA' },
    { value: 'TERMINAL NOVO MUNDO', label: 'TERMINAL NOVO MUNDO' },
    { value: 'CRECHE ESPERANÇA', label: 'CRECHE ESPERANÇA' },
  ];

  // Etapas do processo
  // Função para validar o formulário
  const validarFormulario = () => {
    const novosErros = {
      obra: obra === '',
      dataAvaliacao: !dataAvaliacao,
      avaliador: avaliador === '',
      numColaboradores: numColaboradores === ''
    };
    
    setErros(novosErros);
    
    // Retorna true se não houver erros
    return !Object.values(novosErros).some(erro => erro);
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      console.log('Formulário válido, enviando dados...');
      
      const dados = {
        obra,
        dataAvaliacao,
        avaliador,
        numColaboradores
      };
      
      // Avança diretamente para a próxima página sem mostrar alert
      if (handleNextPage) {
        handleNextPage(dados);
      }
    } else {
      console.log('Formulário inválido. Corrija os erros antes de continuar.');
    }
  };

  // Função para avançar diretamente sem submeter o formulário
  const handleAvancar = () => {
    if (validarFormulario()) {
      const dados = {
        obra,
        dataAvaliacao,
        avaliador,
        numColaboradores
      };
      
      if (handleNextPage) {
        handleNextPage(dados);
      }
    }
  };

  // Função para limpar o formulário
  const limparFormulario = () => {
    setObra('');
    setDataAvaliacao(dayjs());
    setAvaliador('');
    setNumColaboradores('');
    setErros({
      obra: false,
      dataAvaliacao: false,
      avaliador: false,
      numColaboradores: false
    });
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 14, pb: 8 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
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
                    O Índice de Saúde e Segurança no Trabalho (SST) é uma ferramenta essencial para 
                    monitorar e melhorar as condições de segurança nas obras, garantindo um ambiente 
                    de trabalho mais seguro para todos os colaboradores.
                  </Typography>
                  
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
                    Processo de Avaliação:
                  </Typography>
                  
                  <Stepper activeStep={0} orientation="vertical" sx={{ mb: 3 }}>
                    {STEPS.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  
                  <Divider sx={{ mb: 3 }} />
                  
                  <Typography variant="caption" color="text.secondary">
                    Em caso de dúvidas, entre em contato com o setor de Segurança do Trabalho.
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
                  ÍNDICE DE SAÚDE E SEGURANÇA
                </Typography>
                <Typography variant="subtitle1">
                  Avaliação e monitoramento de segurança nas obras
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
                      <BusinessIcon sx={{ mr: 1 }} /> Identificação da Obra
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                      Preencha todos os campos abaixo para identificar corretamente a obra que está sendo avaliada.
                    </Typography>
                  </Grid>
                </Grid>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Campo Obra */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={erros.obra} required>
                        <InputLabel id="obra-label">Nome da Obra</InputLabel>
                        <Select
                          labelId="obra-label"
                          id="obra"
                          value={obra}
                          label="Nome da Obra *"
                          onChange={(e) => setObra(e.target.value)}
                          startAdornment={<BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                        >
                          {obras.map((opcao) => (
                            <MenuItem key={opcao.value} value={opcao.value}>
                              {opcao.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {erros.obra && <FormHelperText>Este campo é obrigatório</FormHelperText>}
                      </FormControl>
                    </Grid>

                    {/* Campo Data da Avaliação */}
                    <Grid item xs={12} md={6}>
                      <DatePicker
                        label="Data da Avaliação *"
                        value={dataAvaliacao}
                        onChange={(newValue) => setDataAvaliacao(newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            error: erros.dataAvaliacao,
                            helperText: erros.dataAvaliacao ? 'Este campo é obrigatório' : '',
                            InputProps: {
                              startAdornment: <CalendarMonthIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            }
                          }
                        }}
                      />
                    </Grid>

                    {/* Campo Avaliador */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        id="avaliador"
                        label="Nome do Avaliador *"
                        fullWidth
                        value={avaliador}
                        onChange={(e) => setAvaliador(e.target.value)}
                        required
                        error={erros.avaliador}
                        helperText={erros.avaliador ? 'Este campo é obrigatório' : ''}
                        InputProps={{
                          startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>

                    {/* Campo Número de Colaboradores */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        id="numColaboradores"
                        label="Número de Colaboradores *"
                        fullWidth
                        value={numColaboradores}
                        onChange={(e) => setNumColaboradores(e.target.value)}
                        required
                        error={erros.numColaboradores}
                        helperText={erros.numColaboradores ? 'Este campo é obrigatório' : ''}
                        InputProps={{
                          startAdornment: <PeopleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>

                    {/* Linha divisória antes dos botões */}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 3 }} />
                    </Grid>

                    {/* Botões */}
                    <Grid item xs={12}>
                      <Stack 
                        direction={{ xs: "column", sm: "row" }} 
                        spacing={2} 
                        justifyContent="space-between"
                        alignItems={{ xs: "stretch", sm: "center" }}
                      >
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Button 
                            variant="contained" 
                            onClick={handleAvancar} // Usando a função direta ao invés do submit
                            size="large"
                            endIcon={<ArrowForwardIcon />}
                            sx={{ 
                              borderRadius: 2,
                              px: 3,
                              bgcolor: theme.palette.primary.main,
                              '&:hover': {
                                bgcolor: theme.palette.primary.dark
                              }
                            }}
                          >
                            Próxima Etapa
                          </Button>
                          {handleBackToHome && (
                            <Button 
                              variant="outlined" 
                              onClick={handleBackToHome}
                              startIcon={<HomeIcon />}
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
                          )}
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
                      </Stack>
                    </Grid>
                  </Grid>
                </form>
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
      </LocalizationProvider>
    </Container>
  );
};

export default FormularioSeguranca;