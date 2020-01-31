
CREATE DATABASE TOLEDO
GO

USE TOLEDO
GO

SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON

CREATE TABLE [dbo].[Messenger_Group](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](100) NOT NULL,
 CONSTRAINT [Messenger_Group_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Messenger_GroupMember](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[GroupId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
 CONSTRAINT [Messenger_GroupMember_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Messenger_Message](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ParentId] [int] NULL,
	[UserId] [int] NOT NULL,
	[SentAt] [datetime] NOT NULL,
	[Type] [int] NOT NULL,
	[Subject] [varchar](100) NOT NULL,
	[Body] [varchar](500) NULL,
	[Data] [varchar](500) NULL,
 CONSTRAINT [Messenger_Message_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Messenger_Recipient](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MessageId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
 CONSTRAINT [Messenger_Recipient_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Messenger_User](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [varchar](100) NOT NULL,
	[UserName] [varchar](100) NOT NULL,
 CONSTRAINT [Messenger_User_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY],
 CONSTRAINT [IX_Messenger_User] UNIQUE NONCLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Messenger_GroupMember]  WITH CHECK ADD  CONSTRAINT [FK_Messenger_GroupMember_Messenger_Group] FOREIGN KEY([GroupId])
REFERENCES [dbo].[Messenger_Group] ([Id])
GO

ALTER TABLE [dbo].[Messenger_GroupMember] CHECK CONSTRAINT [FK_Messenger_GroupMember_Messenger_Group]
GO

ALTER TABLE [dbo].[Messenger_GroupMember]  WITH CHECK ADD  CONSTRAINT [FK_Messenger_GroupMember_Messenger_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[Messenger_User] ([Id])
GO

ALTER TABLE [dbo].[Messenger_GroupMember] CHECK CONSTRAINT [FK_Messenger_GroupMember_Messenger_User]
GO

ALTER TABLE [dbo].[Messenger_Message]  WITH CHECK ADD  CONSTRAINT [FK_Messenger_Message_Messenger_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[Messenger_User] ([Id])
GO

ALTER TABLE [dbo].[Messenger_Message] CHECK CONSTRAINT [FK_Messenger_Message_Messenger_User]
GO

ALTER TABLE [dbo].[Messenger_Recipient]  WITH NOCHECK ADD  CONSTRAINT [FK_Messenger_Recipient_Messenger_Message] FOREIGN KEY([MessageId])
REFERENCES [dbo].[Messenger_Message] ([Id])
GO

ALTER TABLE [dbo].[Messenger_Recipient] CHECK CONSTRAINT [FK_Messenger_Recipient_Messenger_Message]
GO

ALTER TABLE [dbo].[Messenger_Recipient]  WITH NOCHECK ADD  CONSTRAINT [FK_Messenger_Recipient_Messenger_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[Messenger_User] ([Id])
GO

ALTER TABLE [dbo].[Messenger_Recipient] CHECK CONSTRAINT [FK_Messenger_Recipient_Messenger_User]
GO

INSERT INTO Messenger_User (UserId,UserName) VALUES ('SYSTEM','Sistema')
GO

CREATE TABLE [dbo].[Usuario](
	[Id] [int] IDENTITY(1,1) NOT NULL,
    [Nif] [nvarchar](50) NOT NULL,
	[Nombre] [nvarchar](50) NOT NULL,
	[Descripcion] [nvarchar](50) NOT NULL,
	[FechaDeAlta] [datetime] NOT NULL
 CONSTRAINT [PK_Usuario] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT INTO [dbo].[Usuario] (Nif, Nombre, Descripcion, FechaDeAlta) VALUES ('04179642J','Rafael Castro Gómez', 'Usuario administrador', GETDATE());
INSERT INTO [dbo].[Usuario] (Nif, Nombre, Descripcion, FechaDeAlta) VALUES ('04170000J','José Gómez', 'Usuario genérico', GETDATE());
INSERT INTO [dbo].[Usuario] (Nif, Nombre, Descripcion, FechaDeAlta) VALUES ('04170001K','María López Santiago', 'Usuario genérico', GETDATE());
INSERT INTO [dbo].[Usuario] (Nif, Nombre, Descripcion, FechaDeAlta) VALUES ('04100000B','Theressa Kaspar', 'Usuario genérico', GETDATE());


CREATE TABLE [dbo].[Proveedor](
	[Id] [int] IDENTITY(1,1) NOT NULL,
    [Nif] [nvarchar](50) NOT NULL,
	[Nombre] [nvarchar](50) NOT NULL,
	[Descripcion] [nvarchar](50) NOT NULL,
	[FechaDeAlta] [datetime] NOT NULL
 CONSTRAINT [PK_Proveedor] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

INSERT INTO [dbo].[Proveedor] (Nif, Nombre, Descripcion, FechaDeAlta) VALUES ('03479642J','Rafael Castro Gómez', 'Empresa Informática', GETDATE());
INSERT INTO [dbo].[Proveedor] (Nif, Nombre, Descripcion, FechaDeAlta) VALUES ('03470000J','Kimberli Gómez', 'Empresa constructora', GETDATE());
INSERT INTO [dbo].[Proveedor] (Nif, Nombre, Descripcion, FechaDeAlta) VALUES ('03470001K','Allyson López Santiago', 'Mercadona', GETDATE());
INSERT INTO [dbo].[Proveedor] (Nif, Nombre, Descripcion, FechaDeAlta) VALUES ('03400000B','Theressa Kaspar', 'El Corte Inglés', GETDATE());


CREATE TABLE [dbo].[Vehiculo](
	[Id] [int] IDENTITY(1,1) NOT NULL,
    [Matricula] [nvarchar](10) NOT NULL,
	[Marca] [nvarchar](50) NOT NULL,
	[Modelo] [nvarchar](50) NOT NULL,
	[FechaDeAlta] [datetime] NOT NULL
 CONSTRAINT [PK_Vehiculo] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

INSERT INTO [dbo].[Vehiculo] ([Matricula], [Marca], [Modelo], FechaDeAlta) VALUES ('TO2547AG','Seat', 'Panda', GETDATE());
INSERT INTO [dbo].[Vehiculo] ([Matricula], [Marca], [Modelo], FechaDeAlta) VALUES ('2385BBC','Seat', 'Cordoba', GETDATE());
INSERT INTO [dbo].[Vehiculo] ([Matricula], [Marca], [Modelo], FechaDeAlta) VALUES ('0000AAA','Sinca', 'Mil', GETDATE());