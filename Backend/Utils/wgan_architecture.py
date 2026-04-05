import torch
import torch.nn as nn


class Generator(nn.Module):
    """
    Maps latent vector z → synthetic network traffic features.
    Uses BatchNorm + ReLU + Tanh output to match scaled data range.
    """
    def __init__(self, z_dim: int, feature_dim: int):
        super().__init__()
        self.z_dim = z_dim
        self.feature_dim = feature_dim
        self.net = nn.Sequential(
            nn.Linear(z_dim, 256),
            nn.BatchNorm1d(256),
            nn.LeakyReLU(0.2),

            nn.Linear(256, 512),
            nn.BatchNorm1d(512),
            nn.LeakyReLU(0.2),

            nn.Linear(512, 512),
            nn.BatchNorm1d(512),
            nn.LeakyReLU(0.2),

            nn.Linear(512, feature_dim),
        )

    def forward(self, z: torch.Tensor) -> torch.Tensor:
        return self.net(z)


class ResBlock(nn.Module):
    """Residual block with LayerNorm for stable critic training."""
    def __init__(self, dim: int):
        super().__init__()
        self.block = nn.Sequential(
            nn.Linear(dim, dim),
            nn.LayerNorm(dim),
            nn.LeakyReLU(0.2),
            nn.Linear(dim, dim),
            nn.LayerNorm(dim)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return x + self.block(x)


class Critic(nn.Module):
    """
    Critic / Discriminator — learns the manifold of benign traffic.
    High score = benign, low score = anomaly.
    Exposes extract_features() for hybrid scoring.
    """
    def __init__(self, input_dim: int):
        super().__init__()
        self.feature_extractor = nn.Sequential(
            nn.Linear(input_dim, 512),
            nn.LayerNorm(512),
            nn.LeakyReLU(0.2),

            nn.Linear(512, 256),
            nn.LayerNorm(256),
            nn.LeakyReLU(0.2),
        )
        self.res_blocks = nn.Sequential(
            ResBlock(256),
            ResBlock(256),
            ResBlock(256),
            ResBlock(256),
        )
        self.fc_out = nn.Linear(256, 1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        feat = self.feature_extractor(x)
        feat = self.res_blocks(feat)
        return self.fc_out(feat)

    def extract_features(self, x: torch.Tensor) -> torch.Tensor:
        feat = self.feature_extractor(x)
        return self.res_blocks(feat)
def gradient_penalty(
    critic: Critic,
    real: torch.Tensor,
    fake: torch.Tensor,
    device: torch.device
) -> torch.Tensor:
    """
    WGAN-GP gradient penalty — enforces 1-Lipschitz constraint.
    Interpolates between real and fake samples.
    """
    batch_size = real.size(0)
    epsilon = torch.rand(batch_size, 1, device=device).expand_as(real)
    interpolated = (epsilon * real + (1 - epsilon) * fake).requires_grad_(True)

    prob = critic(interpolated)
    gradients = torch.autograd.grad(
        outputs=prob,
        inputs=interpolated,
        grad_outputs=torch.ones_like(prob),
        create_graph=True,
        retain_graph=True,
    )[0]
    gradients = gradients.view(batch_size, -1)
    gp = ((gradients.norm(2, dim=1) - 1) ** 2).mean()
    return gp


# No trailing print
