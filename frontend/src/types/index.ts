export type AlertType =
  | 'enchente'
  | 'deslizamento'
  | 'incendio'
  | 'acidente'
  | 'obra'
  | 'criminalidade'
  | 'falta_energia'
  | 'outros';

export type AlertStatus = 'ativo' | 'resolvido';

export interface Alert {
  id: number;
  title: string;
  description: string;
  type: AlertType;
  status: AlertStatus;
  location: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAlertDTO {
  title: string;
  description: string;
  type: AlertType;
  location: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateAlertDTO extends CreateAlertDTO {
  status: AlertStatus;
}

export interface AlertStats {
  byType: { type: AlertType; count: number }[];
  byStatus: { status: AlertStatus; count: number }[];
  recent24h: number;
  timeline: { day: string; count: number }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
}

export interface AlertFilters {
  type?: AlertType | '';
  status?: AlertStatus | '';
}
