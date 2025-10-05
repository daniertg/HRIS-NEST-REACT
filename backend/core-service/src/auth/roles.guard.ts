import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      throw new ForbiddenException('Access denied: No roles defined');
    }

    const { user } = ctx.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('User not authenticated');

    const userRole = (user.role || '').toLowerCase();
    const allowedRoles = requiredRoles.map(r => r.toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      throw new ForbiddenException('Access denied: Admin only');
    }

    return true;
  }
}
