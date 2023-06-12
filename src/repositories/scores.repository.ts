import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { FilterRequestParams, Repository, Response } from '../models/common';
import { Score } from '../models/database';

import { getPool } from './db';

type ScoresRepository = Repository<Score>;

const create = async (score: Score) => {
  const sql =
    'INSERT INTO scores (name, country, score) VALUES (?, ?, ?); SELECT @score_uuid';
  const conn = getPool();
  const [response] = await conn.query<ResultSetHeader>(sql, [
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
  const sql = 'UPDATE scores SET name = ?, country = ?, score = ? WHERE id = ?';
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
  const sql = 'SELECT * FROM scores WHERE id = ?';
  const conn = getPool();
  const [response] = await conn.query<Array<RowDataPacket>>(sql, [id]);
  const [{ queryable: _, ...result }] = response;
  return result;
};

const readAll = async ({ filter, page, pageSize }: FilterRequestParams) => {
  const hasPagination = Number.isInteger(pageSize) && Number.isInteger(page);
  const countSelect = 'SELECT COUNT(*) as totalElements FROM scores';
  const select = 'SELECT * FROM scores';
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
  const sql = 'DELETE FROM scores WHERE id = ?';
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
