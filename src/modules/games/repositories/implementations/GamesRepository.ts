import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .select()
      .where('UPPER(games.title) LIKE :matchQuery', {
        matchQuery: `%${param.toUpperCase()}%`,
      })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(*) FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const [{ users }] = await this.repository
      .createQueryBuilder("games")
      .leftJoinAndSelect('games.users', 'users')
      .where('games.id = :id', { id })
      .getMany();
  
    return users;
  }
}
