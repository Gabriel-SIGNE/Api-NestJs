import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // const aide = ""
    // return 'DEMOS SERVER ACTIVE!';
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Aide - Demos Server</title>
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }
          body {
            background-color: #f4f6f8;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
          }
          .card {
            background: #ffffff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            max-width: 480px;
            width: 100%;
            text-align: center;
          }
          .badge {
            display: inline-block;
            background-color: #e3f2fd;
            color: #0288d1;
            font-size: 12px;
            font-weight: 600;
            padding: 6px 12px;
            border-radius: 20px;
            margin-bottom: 16px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          h1 {
            color: #1a202c;
            font-size: 24px;
            margin-bottom: 12px;
          }
          p {
            color: #4a5568;
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 28px;
          }
          .actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .btn {
            display: block;
            padding: 12px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s ease;
          }
          .btn-primary {
            background-color: #3182ce;
            color: #ffffff;
          }
          .btn-primary:hover {
            background-color: #2b6cb0;
          }
          .btn-secondary {
            background-color: #edf2f7;
            color: #2d3748;
          }
          .btn-secondary:hover {
            background-color: #e2e8f0;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">DEMOS SERVER ACTIVE!</span>
          <h1>Centre d'aide</h1>
          <p>Consultez la documentation officielle ci-dessous pour découvrir l'ensemble des routes et fonctionnalités de l'API.</p>
          <div class="actions">
            <a href="/aide" class="btn btn-primary">Documentation</a>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
