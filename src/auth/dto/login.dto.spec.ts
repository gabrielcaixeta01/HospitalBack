import { validate } from 'class-validator';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  describe('validation', () => {
    it('should validate username and password according to defined constraints', async () => {
      const dto = new LoginDto();
      dto.username = 'testuser';
      dto.password = 'validpass';

      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should fail validation when username is not a string', async () => {
      const dto = new LoginDto();
      dto.username = 123 as any;
      dto.password = 'validpass';

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('username');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail validation when username is missing', async () => {
      const dto = new LoginDto();
      dto.password = 'validpass';

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('username');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail validation when password is not a string', async () => {
      const dto = new LoginDto();
      dto.username = 'testuser';
      dto.password = 123 as any;

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail validation when password is missing', async () => {
      const dto = new LoginDto();
      dto.username = 'testuser';

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });

    it('should fail validation when password is less than 4 characters', async () => {
      const dto = new LoginDto();
      dto.username = 'testuser';
      dto.password = 'abc';

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should pass validation when password is exactly 4 characters', async () => {
      const dto = new LoginDto();
      dto.username = 'testuser';
      dto.password = 'abcd';

      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should pass validation when password is more than 4 characters', async () => {
      const dto = new LoginDto();
      dto.username = 'testuser';
      dto.password = 'longerpassword123';

      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should fail validation when both username and password are invalid', async () => {
      const dto = new LoginDto();
      dto.username = null as any;
      dto.password = 'ab';

      const errors = await validate(dto);

      expect(errors.length).toBe(2);
      const properties = errors.map((e) => e.property);
      expect(properties).toContain('username');
      expect(properties).toContain('password');
    });
  });
});
