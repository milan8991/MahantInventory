CREATE TABLE [dbo].[Storages]
(
	[Id] INT NOT NULL Identity(1,1),
	[Name] varchar(128) not null,
	[Enabled] bit not null
	Constraint PK_Storages_Id Primary Key(Id)
)
