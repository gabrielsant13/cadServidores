CREATE DATABASE servidores;

CREATE TABLE SERVIDOR(
    ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    NOME VARCHAR(50),
    ID_CARGO INT
);

CREATE TABLE CARGO(
    ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    NOME VARCHAR(50),
    DESCRICAO VARCHAR(50)
);

/*inserindo dados na tabela*/
INSERT INTO cargo (nome, descricao) VALUES ('chefe', 'comanda o setor');

/*deletando um dado da tabela (se esquecer o WHERE, todo os dados da tabela sera deletado)*/
DELETE FROM cargo WHERE id = 3;


/* TRANSFORMANDO A  CHAVE PRIMARIA DE CARGO (ID) NA CHAVE ESTRANGEIRA DE SERVIDOR (ID_CARGO)*/
ALTER TABLE SERVIDOR ADD CONSTRAINT FOREIGN KEY (ID_CARGO) REFERENCES CARGO(ID);

/* CRIANDO USUARIO*/
CREATE USER 'gabriel'@'localhost' IDENTIFIED WITH mysql_native_password BY '';

/*DANDO PERMISSAO AO USUARIO*/
GRANT ALL PRIVILEGES ON * . * TO 'gabriel'@'localhost';

/*PESQUISANDO NOME DO SERVIDOR, CARGO E DESCRICAO DE CARGO, UTILIZANDO OS CONCEITOS
DE CHAVES PRIMARIA E SECUNDARIA*/
select servidores.servidor.nome, servidores.cargo.nome_cargo, servidores.cargo.descricao from servidores.servidor inner join servidores.cargo on servidores.servidor.id_cargo = servidores.cargo.id; 