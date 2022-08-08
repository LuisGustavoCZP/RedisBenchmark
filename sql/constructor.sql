CREATE TABLE public.users (
	"id" serial NOT NULL,
	"firstname" varchar(255) NOT NULL,
	"lastname" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"birthday" varchar(10) NOT NULL,
	"phone" varchar(14) NOT NULL,
	"gender" varchar(10) NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);