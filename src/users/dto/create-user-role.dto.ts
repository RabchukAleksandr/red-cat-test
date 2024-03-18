import { CreateUserDto } from './create-user.dto';

interface AttachUserRole {
  activeRole: string;
  roles: string[];
}
export class CreateUserRoleDto {
  user: CreateUserDto;
  role: AttachUserRole;
}
