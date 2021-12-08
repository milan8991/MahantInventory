CREATE TABLE [dbo].[Payers]
(
	[Id] INT NOT NULL Identity(1,1),
	[Name] varchar(256) not null,
	[PrimaryContact] varchar(15) not null,
	[SecondaryContact] varchar(15) null,
	[LastModifiedById] nvarchar(450) not null,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo]),
	Constraint PK_Payers_Id Primary Key(Id),
	Constraint UNQ_PrimaryContact Unique (PrimaryContact),
	CONSTRAINT FK_Payers_LastModifiedById FOREIGN KEY (LastModifiedById) REFERENCES AspNetUsers(Id),
)
