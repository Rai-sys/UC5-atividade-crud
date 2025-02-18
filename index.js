// Importando
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORTA;
const app = express();

// aplicando com json
app.use(express.json());

// banco de dados das reservas
const reservaDados = [];

// criando reserva
app.post('/reservas', (requisicao, resposta) => {
    try {
        const {id, usuario, sala, dataHoraInicio, dataHoraTermino, status} = requisicao.body;
        if (!id || !usuario || !sala || !dataHoraInicio || !dataHoraTermino || !status) {
            return resposta.status(200).json({mensagem: "Todos os campos devem ser preenchidos."});
        };
        const novaReserva = {id, usuario, sala, dataHoraInicio, dataHoraTermino, status};
        reservaDados.push(novaReserva);
        resposta.status(201).json({mensagem: "Sua reserva foi criada!"});
    } catch (error) {
        resposta.status(500).json({mensagem: "Erro ao cadastrar reserva. Tente novamente!", erro: error.message});
    };
});

// pegando todas as reservas
app.get('/reservas', (requisicao, resposta) => {
    try {
        if (reservaDados === 0) {
            return resposta.status(200).json({mensagem: "Não tem nenhuma reserva cadastrada."});
        }
        resposta.status(200).json(reservaDados);
    } catch (error) {
        resposta.status(500).json({mensagem: "Erro as buscar reservas.", erro: error.message});
    };
});

// pegando reserva pelo id
app.get('/reservas/:id', (requisicao, resposta) => {
    try {
        const id = requisicao.params.id;
        const reserva = reservaDados.find(elemento => elemento.id === id);
        if (!reserva) {
            return resposta.status(404).json({mensagem: "Reserva não encontrada."});
        };
        resposta.status(200).json(reserva);
    } catch (error) {
        resposta.status(500).json({mensagem: "Erro ao buscar reserva. Tente novamente!", erro: error.message});
    };
});

//editando reserva
app.put('/reservas/:id', (requisicao, resposta) => {
    try {
        const id = requisicao.params.id;
        const {novaDataHoraInicio, novaDataHoraTermino, novoStatus} = requisicao.body;
        if (!id) {
            return resposta.status(404).json({mensagem: "Informe o ID da reserva."});
        };
        const reserva = reservaDados.find(elemento => elemento.id === id);
        if (!reserva) {
            return resposta.status(404).json({mensagem: "Reserva não encontrada. Tente novamente!"});
        };
        if (reserva) {
            reserva.dataHoraInicio = novaDataHoraInicio || reserva.dataHoraInicio
            reserva.dataHoraTermino = novaDataHoraTermino || reserva.dataHoraTermino
            reserva.status = novoStatus || reserva.status
        };
        resposta.status(200).json({mensagem: "Reserva atualizada com sucesso!"});
    } catch (error) {
        resposta.status(500).json({mensagem: "Erro ao atualizar reserva. Tente novamente!"});
    };
});

//deletando reservas
app.delete('/reservas', (requisicao, resposta) => {
    try {
        reservaDados.length = 0;
        resposta.status(200).json({mensagem: "Todas as reservas foram excluídas."});
    } catch (error) {
        resposta.status(500).json({mensagem: "Erro ao excluir reservas. Tente novamente!"});
    };
});

// deletando reserva pelo id
app.delete('/reservas/:id', (requisicao, resposta) => {
    try {
        const id = requisicao.params.id;
        const index = reservaDados.findIndex(elemento => elemento.id === id);
        if (index === -1) {
            return resposta.status(404).json({mensagem: "Essa reserva não foi encontrada."});
        };
        reservaDados.splice(index, 1);
        resposta.status(200).json({mensagem: "Reservas deleta com sucesso!"});
    } catch (error) {
        resposta.status(500).json({mensagem: "Erro ao deletar reservas. Tente novamente!", erro: error.message});
    };
});

// porta do sistema
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
})