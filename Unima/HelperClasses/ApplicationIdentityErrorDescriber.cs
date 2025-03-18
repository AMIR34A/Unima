using Microsoft.AspNetCore.Identity;

namespace Unima.HelperClasses;

public class ApplicationIdentityErrorDescriber : IdentityErrorDescriber
{
    public override IdentityError DuplicateUserName(string userName) => new IdentityError { Code = nameof(DuplicateUserName), Description = $"شماره دانشجویی ({userName}) در سامانه موجود می‌باشد" };
    public override IdentityError InvalidUserName(string? userName) => new IdentityError { Code = nameof(InvalidUserName), Description = "شماره دانشجویی باید فقط شامل اعداد (0-9) باشد" };
    public override IdentityError PasswordRequiresDigit() => new IdentityError { Code = nameof(PasswordRequiresDigit), Description = "کلمه عبور باید شامل حداقل یکی از اعداد (0-9) باشد" };
    public override IdentityError PasswordRequiresLower() => new IdentityError { Code = nameof(PasswordRequiresLower), Description = "کلمه عبور باید شامل حداقل یک حرف کوچک (a-z) باشد" };
    public override IdentityError PasswordRequiresUpper() => new IdentityError { Code = nameof(PasswordRequiresUpper), Description = "کلمه عبور باید شامل حداقل یک حرف بزرگ (A-Z) باشد" };
    public override IdentityError PasswordTooShort(int length) => new IdentityError { Code = nameof(PasswordTooShort), Description = $"کلمه عبور باید حداقل شما {length} حروف،عدد و علامت باشد" };
    public override IdentityError DuplicateRoleName(string role) => new IdentityError { Code = nameof(DuplicateRoleName), Description = $"نقش '{role}' وجود دارد" };
}
