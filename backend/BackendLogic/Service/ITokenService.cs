namespace BackendLogic.Service;

public interface ITokenService
{
    string GenerateToken(string username);
}