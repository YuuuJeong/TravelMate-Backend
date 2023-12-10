import { Test, TestingModule } from '@nestjs/testing';
import { FriendService } from './friend.service';
import { PrismaService } from '../prisma.service';
import { FriendInviteStatus } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

describe('FriendService', () => {
  let service: FriendService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendService, PrismaService],
    }).compile();

    service = module.get<FriendService>(FriendService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('친구 삭제시, 친구 초대 및 친구 기록이 있다면 친구를 삭제한다.', async () => {
    // Given
    const friendInviteId = 1;

    const findFriend = jest
      .spyOn(prisma.friendInvite, 'findUniqueOrThrow')
      .mockResolvedValue({
        id: 1,
        friendId: 4,
        userId: 5,
        acceptedAt: new Date(),
        createdAt: new Date(),
        status: FriendInviteStatus.ACCEPTED,
      });

    const deleteFriends = jest.spyOn(prisma.friendInvite, 'deleteMany');

    //when
    const result = await service.removeFriend(friendInviteId);

    //then
    expect(findFriend).toHaveBeenCalledTimes(1);
    expect(deleteFriends).toHaveBeenCalledTimes(1);
  });

  it('친구 삭제시, 친구 초대 및 친구 기록이 없다면 에러를 던진다.', async () => {
    // Given
    const friendInviteId = 1;

    jest
      .spyOn(prisma.friendInvite, 'findUniqueOrThrow')
      .mockImplementation(() => {
        throw new Error('There was an error.');
      });

    //when & then
    await expect(service.removeFriend(friendInviteId)).rejects.toThrowError(
      'There was an error.',
    );
  });

  it('친구 수락시, 두 개의 로우를 모두 관리한다.', async () => {
    // Given
    const friendInviteId = 1;

    const update = jest.spyOn(prisma.friendInvite, 'update').mockResolvedValue({
      id: 1,
      friendId: 4,
      userId: 5,
      acceptedAt: new Date(),
      createdAt: new Date(),
      status: FriendInviteStatus.ACCEPTED,
    });

    const create = jest.spyOn(prisma.friendInvite, 'create').mockResolvedValue({
      id: 1,
      friendId: 5,
      userId: 4,
      acceptedAt: new Date(),
      createdAt: new Date(),
      status: FriendInviteStatus.ACCEPTED,
    });

    //when
    const result = await service.acceptFriendInvitation(friendInviteId);

    // then

    expect(create).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledTimes(1);
    expect(result).toBe('친구가 추가되었습니다.');
  });

  it('친구 요청을 보낼 때, 본인에게 친구요청을 보내고자 할 때는 에러를 던진다.', async () => {
    // Given
    const id = 1;
    const friendId = 1;

    //when
    const result = async () => {
      await service.sendFriendInviteRequest(id, friendId);
    };

    // then
    expect(result).rejects.toThrowError(
      new BadRequestException('본인에게 친구요청을 할 수 없습니다.'),
    );
  });

  it('친구 요청을 보낼 때, 이미 해당 유저와 친구라면 에러를 던진다. ', async () => {
    // Given
    const id = 1;
    const friendId = 2;

    jest.spyOn(prisma.friendInvite, 'findFirst').mockResolvedValue({
      id: 1,
      friendId: 2,
      userId: 1,
      acceptedAt: new Date(),
      createdAt: new Date(),
      status: FriendInviteStatus.ACCEPTED,
    });

    //when
    const result = async () => {
      await service.sendFriendInviteRequest(id, friendId);
    };

    // then
    expect(result).rejects.toThrowError(
      new BadRequestException('이미 친구관계인 유저입니다.'),
    );
  });

  it('친구 요청을 보낼 때, 상대방으로부터 이미 친구요청을 받았다면 바로 수락이 된다. ', async () => {
    // Given
    const id = 1;
    const friendId = 2;

    const findFirst = jest
      .spyOn(prisma.friendInvite, 'findFirst')
      .mockResolvedValue(null);

    jest.spyOn(prisma.friendInvite, 'findUnique').mockResolvedValueOnce(null);
    const findUnique = jest
      .spyOn(prisma.friendInvite, 'findUnique')
      .mockResolvedValueOnce({
        id: 1,
        friendId: id,
        userId: friendId,
        acceptedAt: new Date(),
        createdAt: new Date(),
        status: FriendInviteStatus.ACCEPTED,
      });

    const update = jest.spyOn(prisma.friendInvite, 'update').mockResolvedValue({
      id: 1,
      friendId: 4,
      userId: 5,
      acceptedAt: new Date(),
      createdAt: new Date(),
      status: FriendInviteStatus.ACCEPTED,
    });

    const create = jest.spyOn(prisma.friendInvite, 'create').mockResolvedValue({
      id: 1,
      friendId: 5,
      userId: 4,
      acceptedAt: new Date(),
      createdAt: new Date(),
      status: FriendInviteStatus.ACCEPTED,
    });

    //when
    const result = await service.sendFriendInviteRequest(id, friendId);

    //then
    expect(findFirst).toHaveBeenCalledTimes(1);
    expect(findUnique).toHaveBeenCalledTimes(2);
    expect(update).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledTimes(1);
    expect(result).toBe('친구가 추가되었습니다.');
  });

  it('친구 요청을 보낼 때, 상대방으로부터 이미 친구요청을 받은게 없다면 요청을 보낸다 ', async () => {
    // Given
    const id = 1;
    const friendId = 2;
    const date = new Date();
    const findFirst = jest
      .spyOn(prisma.friendInvite, 'findFirst')
      .mockResolvedValue(null);

    const findUnique = jest
      .spyOn(prisma.friendInvite, 'findUnique')
      .mockResolvedValue(null);

    const update = jest.spyOn(prisma.friendInvite, 'update');
    const create = jest.spyOn(prisma.friendInvite, 'create').mockResolvedValue({
      id: 1,
      friendId: 5,
      userId: 4,
      acceptedAt: date,
      createdAt: date,
      status: FriendInviteStatus.ACCEPTED,
    });

    //when
    const result = await service.sendFriendInviteRequest(id, friendId);

    //then
    expect(findFirst).toHaveBeenCalledTimes(1);
    expect(findUnique).toHaveBeenCalledTimes(2);
    expect(update).toHaveBeenCalledTimes(0);
    expect(create).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      id: 1,
      friendId: 5,
      userId: 4,
      acceptedAt: date,
      createdAt: date,
      status: FriendInviteStatus.ACCEPTED,
    });
  });
});
