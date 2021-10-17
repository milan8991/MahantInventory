CREATE TABLE [dbo].[Products]
(
	[Id] INT NOT NULL Identity(1,1),
	[Name] varchar(255) not null,
	[Size] int null,
	[Description] nvarchar(900) null,
	[UnitTypeCode] varchar(12) not null,
	[ReorderLevel] decimal(10,2) not null,
	[IsDisposable] bit not null,
	[Company] varchar(256) null,
	[StorageId] int null,
	[Enabled] bit not null,
	[LastModifiedById] nvarchar(450) not null,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo]),
	Constraint PK_Products_Id Primary Key(Id),
	Constraint FK_Products_UnitTypeId Foreign Key(UnitTypeCode) references UnitTypes(Code),
	Constraint CUK_Name_UnitTypeCode Unique([Name],Size, UnitTypeCode),
	Constraint FK_Products_StorageId  Foreign Key(StorageId) references Storages(Id),
	CONSTRAINT FK_Products_LastModifiedById FOREIGN KEY (LastModifiedById) REFERENCES AspNetUsers(Id),
)
WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.[Products_History] , DATA_CONSISTENCY_CHECK = ON ))