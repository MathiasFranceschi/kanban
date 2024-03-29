

BEGIN;

--- Par prévention, on commence par supprimer des tables qui porteraient déjà ce nom
--- ps: on rajoute la suppression de la table tag afin de supprimer la table de ce nom qui a pu être créée lors de l'atelier
DROP TABLE IF EXISTS "list", "card", "label", "card_has_label", "tag";

--- on peut maintenant créer les tables
CREATE TABLE "list" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT '',
    "position" SMALLINT NOT NULL DEFAULT 0,
    --- les champs liés au timestamp
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "card" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "description" TEXT NOT NULL DEFAULT '',
    "color" VARCHAR,
    "position" SMALLINT NOT NULL DEFAULT 0,
    --- Lorsqu'une liste sera supprimée, toutes les cartes liées à cette entrée seront aussi supprimées
    "list_id" INTEGER NOT NULL REFERENCES "list"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "label" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT '',
    "color" VARCHAR NOT NULL DEFAULT '#FFF',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "card_has_label" (
    "card_id" INTEGER NOT NULL REFERENCES "card"("id") ON DELETE CASCADE,
    "label_id" INTEGER NOT NULL REFERENCES "label"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--- On va aussi rajouter des données

INSERT INTO "list"("name") VALUES
    ('a cuisiner'),
    ('à ranger'),
    ('plantes à arroser');

INSERT INTO "card"("description", "color", "list_id") VALUES
    ('blabla', '#f0f', 1),
    ('bladd', '#fff', 1),
    ('blaeeddddd', '#000', 2),
    ('zedzedzedze', '#fff', 1),
    ('zzozoooooooooooooooo', '#aaa', 2);

INSERT INTO "label"("name", "color") VALUES
    ('important', '#e82'),
    ('no rush', '#0af');

INSERT INTO "card_has_label"("card_id", "label_id") VALUES
    (1, 2),
    (2, 2),
    (3, 1);


COMMIT;