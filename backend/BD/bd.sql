create database gamp;
use gamp;

create table usuarios (
	idUsuario int key unique auto_increment,
    nomeUsuario varchar(18) unique not null,
    senhaUsuario varchar(255) not null,
    emailUsuario varchar(255) unique not null,
    bioUsuario varchar(255),
    imgUsuario varchar(255)
);

create table seguidores (
	idSeguidor int,
    idSeguindo int,
    foreign key (idSeguidor) references usuarios(idUsuario),
    foreign key (idSeguindo) references usuarios(idUsuario)
);

create table posts (
	idPost int key unique auto_increment,
    idPublicador int not null,
    nomeJogo varchar(150) not null,
    comentario varchar(255) not null,
    estado varchar(12) not null,
    imgJogo varchar(1000) not null,
    foreign key(idPublicador) references usuarios(idUsuario)
    );
    
create table resenhas (
	idResenha int key unique auto_increment,
    idPublicador int not null,
    nomeJogo varchar(150) not null,
    nota int not null,
    comentario varchar(255) not null,
    imgJogo varchar(1000) not null,
    foreign key(idPublicador) references usuarios(idUsuario)
    );
    
create table comunidades (
    idComunidade int key unique auto_increment,
    nomeComunidade varchar(150) not null,
    descComunidade varchar(255),
    imagemComunidade varchar(255)
);

create table postComu (
    idPost int key unique auto_increment,
    idPublicador int not null, 
    idComunidade int not null,
    comentario varchar(255) not null,
    foreign key(idPublicador) references usuarios(idUsuario),
    foreign key(idComunidade) references comunidades(idComunidade)
);

create table membros (
    idMembro int key unique auto_increment,
    idUsuario int not null,
    idComunidade int not null,
    cargo enum('membro', 'adm') not null,
    foreign key(idUsuario) references usuarios(idUsuario),
    foreign key(idComunidade) references comunidades(idComunidade)
);
    
    

insert into usuarios values (null, 'Lívia', 'livia123', 'livia@gmail.com', "Mente criativa por trás deste site com quem vós acessa", "../imagens/perfil.jpg");

insert into usuarios values (null, 'LeMartins', '12345', 'leticia@gmail.com', "Não sei o que botar aqui, desculpa Letícia", "../imagens/perfil.jpg");

insert into usuarios values (null, 'Aloísio', 'aloisinho', 'aloisio@gmail.com', "Desenvolvedor do site com quem vós acessais", "../imagens/perfil.jpg");

insert into seguidores values (1, 3), (1, 2);

insert into posts values (null, 1, 'Overcooked', 'nossa meu, muito merda!!!', 'Abandonei', 'https://media.rawg.io/media/games/270/270b412b66688081497b3d70c100b208.jpg');

insert into resenhas values (null, 1, 'Overcooked', 1, 'nossa meu, muitooo merdada/111!!!', 'https://media.rawg.io/media/games/270/270b412b66688081497b3d70c100b208.jpg');

insert into comunidades values (124, 'Gamp', 'Comunidade oficial dos Devs', '../imagens/fotosComunidade/Gamp.jpg');

insert into membros values
(null, 1, 124, 'adm'),
(null, 2, 124, 'adm'),
(null, 3, 124, 'adm');