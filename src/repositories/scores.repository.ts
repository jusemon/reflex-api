import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { FilterRequestParams, Repository, Response } from '../models/common';
import { Score } from '../models/database';
import { getPool } from './db';
import { AppError } from '../middlewares/error.middleware';

type ScoresRepository = Repository<Score>;
const SCORE_UUID = '@score_uuid';

const create = async (score: Score) => {
  const sql =
    'INSERT INTO scores (id, name, country, score) VALUES (UUID_TO_BIN(?), ?, ?, ?);';
  const conn = getPool(true);
  const [response] = await conn.query<ResultSetHeader>(sql, [
    score.id,
    score.name,
    score.country,
    score.score,
  ]);
  if (response.affectedRows) {
    return { ...score };
  }
  return null;
};

const update = async (score: Score) => {
  const sql =
    'UPDATE scores SET name = ?, country = ?, score = ? WHERE id = UUID_TO_BIN(?)';
  const conn = getPool();
  const [response] = await conn.query<ResultSetHeader>(sql, [
    score.name,
    score.country,
    score.score,
    score.id,
  ]);
  if (response.affectedRows) {
    return { ...score };
  }
  return null;
};

const read = async (id: string) => {
  const sql =
    'SELECT *, BIN_TO_UUID(id) as id FROM scores WHERE id = UUID_TO_BIN(?)';
  const conn = getPool();
  const [response] = await conn.query<Array<RowDataPacket>>(sql, [id]);
  if (response.length === 0) {
    throw new AppError(404, 'Score not found');
  }
  const [{ queryable: _, ...result }] = response;
  return result;
};

const readAll = async ({ filter, page, pageSize }: FilterRequestParams) => {
  const hasPagination = Number.isInteger(pageSize) && Number.isInteger(page);
  const countSelect = 'SELECT COUNT(*) as totalElements FROM scores';
  const select =
    'SELECT *, BIN_TO_UUID(id) as id FROM scores ORDER BY score DESC';
  const where = filter ? ' WHERE queryable like ?' : '';
  const pagination = hasPagination ? ' LIMIT ? OFFSET ?' : '';

  const conn = getPool();

  const [[{ totalElements }]] = await conn.query<Array<RowDataPacket>>(
    countSelect + where,
    [...(filter ? [`%${filter}%`] : [])],
  );
  const [results] = await conn.query<Array<RowDataPacket>>(
    select + where + pagination,
    [
      ...(filter ? [`%${filter}%`] : []),
      ...(hasPagination ? [pageSize!, page! * pageSize!] : []),
    ],
  );
  const data = results.map<Score>((result: any) => {
    const { queryable: _, ...score } = result;
    return score;
  });

  return {
    data,
    page: page || 0,
    totalElements,
    pageSize: data.length,
  } as Response<Score>;
};

const remove = async (id: string) => {
  const sql = 'DELETE FROM scores WHERE id = UUID_TO_BIN(?)';
  const conn = getPool();
  await conn.query(sql, [id]);
};

export default {
  create,
  read,
  readAll,
  update,
  remove,
} as ScoresRepository;
