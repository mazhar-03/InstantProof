namespace BackendLogic.Dto;

public class AccountDto
{
    public string Username { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
}