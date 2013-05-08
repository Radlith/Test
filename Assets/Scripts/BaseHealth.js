#pragma strict

//Normal HP
public var MaxHP : float = 0;
public var CurrentHP : float;

public var HealthBar : BaseHealthBar;

//Shield HP
public var MaxShieldHP : float = 0;
public var CurrentShieldHP : float;
public var ShieldEffectiveness : float = 1;

public var RegenRate : float = 1;
public var RegenDelay : float = 1;
public var RegenTimer : float = 0;

function Start () {
	CurrentHP = MaxHP;
	CurrentShieldHP = MaxShieldHP;
	
	if(!HealthBar)
	{
		HealthBar = GetComponent(BaseHealthBar);
	}
	UpdateHealthBar();		
}

function Update () {
	if(CurrentShieldHP < MaxShieldHP)
	{
		if(RegenTimer > 0)
		{
			RegenTimer -= Time.deltaTime;
		}
		else
		{
			CurrentShieldHP = Mathf.Clamp(CurrentShieldHP + (RegenRate * Time.deltaTime), 0, MaxShieldHP);
			UpdateHealthBar();
		}
	}
}

function ReceiveDamage(fDamage : float)
{
	ReceiveDamage(fDamage, 0);
}

function ReceiveDamage(fDamage : float, fShieldPiercing : float)
{
	OnReceiveDamage();
	RegenTimer = RegenDelay;

	if (CurrentShieldHP > 0)
	{
		if(CurrentShieldHP > fDamage)
		{
			CurrentShieldHP -= fDamage;
			//Shields may not be 100% effective, and some weapons may bypass shields partly.  Shields still take the damage.
			CurrentHP -= Mathf.Clamp01(1 + fShieldPiercing - ShieldEffectiveness) * fDamage;
		}
		else
		{
			CurrentHP -= (fDamage - CurrentShieldHP);
			CurrentHP -= Mathf.Clamp01(1 + fShieldPiercing - ShieldEffectiveness) * CurrentShieldHP;
			CurrentShieldHP = 0;
		}
	}
	else
	{
		CurrentHP -= fDamage;
	}
	
	if (CurrentHP <= 0)
	{
		Destroy(this.gameObject);
	}
	else 
	{
		UpdateHealthBar();
	}
}

function UpdateHealthBar()
{
	if(HealthBar)
	{
		HealthBar.shieldhpratio = CurrentShieldHP / MaxShieldHP;
		HealthBar.hpratio = CurrentHP / MaxHP;
		HealthBar.bShowShields = (CurrentShieldHP > 0);
	}
}

//Event called when damaged
function OnReceiveDamage(){}

//Event called when HP goes below zero
function OnDestroyed(){}